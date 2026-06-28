import { redirect } from "react-router"
import { fetchUserData } from "./auth-utils"
import { type MatchesDBResponse } from "~/types/game-types"
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
  const [user, existingMatches] = await Promise.all([
    fetchUserData(request),
    fetch("http://localhost:5000/match", {
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
