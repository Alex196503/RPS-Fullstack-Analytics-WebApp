import { redirect } from "react-router"
import { fetchUserData } from "./auth-utils"
import { type MatchesDBResponse } from "~/types/game-types"
import { toast } from "react-toastify"
//Parses a raw game message to extract a standardized outcome ('win', 'loss', or 'draw').
export function parseGameOutcome(message: string) {
  let cleanOutcome = ""
  if (message.toLowerCase().includes("win")) cleanOutcome = "win"
  else if (
    message.toLowerCase().includes("lost") ||
    message.toLowerCase().includes("loss")
  )
    cleanOutcome = "loss"
  else {
    message.toLowerCase().includes("draw") ||
      message.toLowerCase().includes("tie")
    cleanOutcome = "draw"
  }
  return cleanOutcome
}

//This function is a utility for making API calls to the authentication server. It takes the API endpoint, a redirect link, and the payload (form data) as arguments. It handles the fetch request and returns a standardized response object indicating success or failure, along with any error messages or data returned from the server.
export async function fetchAuthenticationApi(
  link: string,
  payload: FormData | Record<string, string> | string
) {
  try {
    let req = await fetch(link, {
      method: "POST",
      body:
        payload instanceof FormData
          ? payload
          : JSON.stringify(payload),
      headers:
        payload instanceof FormData
          ? {}
          : {
              "Content-Type": "application/json"
            },
      credentials: "include"
    })
    const res = await req.json()
    if (!req.ok) {
      return {
        success: false,
        errors: res.errors || { server: res.message }
      }
    }
    return {
      success: true,
      errors: null,
      data: res
    }
  } catch (err) {
    return {
      success: false,
      errors: {
        global: "Could not connect to the authentication server."
      }
    }
  }
}
//Fetches all necessary data for the History page in parallel and validates user authentication and extracts any download error params from the URL.
export async function fetchHistoryPageData(request: Request) {
  const cookieHeaders = request.headers.get("Cookie") || ""
  const url = new URL(request.url)
  const errorParams = url.searchParams.get("error") || ""
  const backendUrl =
    process.env.BACKEND_API_URL || "http://localhost:5000"
  const [user, existingMatches] = await Promise.all([
    fetchUserData(request),
    fetch(`${backendUrl}/match`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeaders
      },
      credentials: "include"
    })
  ])
  if (
    user instanceof Response &&
    (user.status === 302 || user.status === 303)
  ) {
    throw redirect("/login")
  }
  if (
    existingMatches.status === 302 ||
    existingMatches.status === 401
  ) {
    throw redirect("/login")
  }
  const matchesData =
    (await existingMatches.json()) as MatchesDBResponse

  return {
    user,
    matches: matchesData.data || [],
    errorMessage:
      errorParams === "no_matches"
        ? "No matches found to download the CSV file"
        : null
  }
}

//Handler function that sends a validated CSV file to the backend server using FormData mechanism
export async function sendCSVFileToServer(link: string, file: File) {
  const formData = new FormData()
  formData.append("csvFile", file)
  try {
    let req = await fetch(link, {
      method: "POST",
      body: formData,
      credentials: "include"
    })
    let data = (await req.json()) as {
      message: string
      success: boolean
    }
    return data
  } catch (err) {
    return {
      message:
        err instanceof Error
          ? err.message
          : "Network error occurred!",
      success: false
    }
  }
}

//Handler function that sends a DELETE request to the backend server to reset the user's match history
export async function deleteUserMatchHistory(link: string) {
  try {
    let req = await fetch(link, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
    let data = (await req.json()) as {
      success: boolean
      message: string
    }
    if (!req.ok) {
      throw new Error(
        data.message || "Something went wrong on the server"
      )
    }
    toast.success(data.message || "Match history reset successfully")
  } catch (err) {
    console.error("Delete request failed:", err)
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Network error, please try again."
    toast.error(errorMessage)
  }
}
