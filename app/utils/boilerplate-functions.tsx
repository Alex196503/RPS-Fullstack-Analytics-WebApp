// This file contains boilerplate functions that can be used across the application.

//This function validates the registration form inputs on the frontend before submission. It checks for required fields, email format, password strength, and file size for the avatar image. It returns an object containing error messages for any invalid fields or null if all inputs are valid.
import { redirect } from "react-router"
export const validateFrontendRegistration = (
  email: string,
  password: string,
  username: string,
  avatarFile: File | null,
  confirmPassword: string
) => {
  const errors: Record<string, { _errors: string[] }> = {}
  if (!email) {
    errors.email = { _errors: ["Email is required"] }
  } else if (
    typeof email === "string" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.email = { _errors: ["Please enter a valid email address"] }
  }
  if (!password) {
    errors.password = { _errors: ["Password is required"] }
  }
  if (!username) {
    errors.username = { _errors: ["Username is required"] }
  }
  if (!avatarFile || avatarFile.name === "") {
    errors.avatar = { _errors: ["Avatar image is required"] }
  } else if (avatarFile.size > 5 * 1024 * 1024) {
    errors.avatar = {
      _errors: ["Avatar file size must be less than 5MB"]
    }
  }
  if (!password) {
    errors.password = { _errors: ["Password is required"] }
  } else if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)) {
    errors.password = {
      _errors: [
        "Password must be at least 6 characters long and contain both letters and numbers."
      ]
    }
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = { _errors: ["Passwords do not match"] }
  }
  return Object.keys(errors).length > 0 ? errors : null
}

//This function validates the login form inputs on the frontend before submission. It checks for required fields, email format, and password strength.
export const validateFrontendLogin = (
  email: string,
  password: string
) => {
  const errors: Record<string, { _errors: string[] }> = {}
  if (!email) {
    errors.email = { _errors: ["Email is required"] }
  } else if (
    typeof email === "string" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.email = { _errors: ["Please enter a valid email address"] }
  }
  if (!password) {
    errors.password = { _errors: ["Password is required"] }
  } else if (
    typeof password === "string" &&
    !/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)
  ) {
    errors.password = {
      _errors: [
        "Password must be at least 6 characters long and contain both letters and numbers."
      ]
    }
  }
  return Object.keys(errors).length > 0 ? errors : null
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

//Prevents authenticated users from accessing guest-only routes (like Login or Register). If a valid token cookie is detected, it automatically redirects them to the home page.
export const redirectIfAuthenticated = (request: Request) => {
  const cookieHeaders = request.headers.get("Cookie") || ""
  if (cookieHeaders.includes("token=")) {
    return redirect("/")
  }
  return null
}
