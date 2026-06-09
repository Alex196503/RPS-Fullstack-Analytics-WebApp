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
  payload: FormData | Record<string, string>
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
