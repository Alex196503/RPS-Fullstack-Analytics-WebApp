import { redirect } from "react-router"

//This function validates the registration form inputs on the frontend before submission. It checks for required fields, email format, password strength, and file size for the avatar image. It returns an object containing error messages for any invalid fields or null if all inputs are valid.
export const validateFrontendRegistration = (
  email: string,
  password: string,
  username: string,
  avatarFile: File | null,
  confirmPassword: string
) => {
  const errors =
    validatePasswordMatch(password, confirmPassword) || {}
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

//Prevents authenticated users from accessing guest-only routes (like Login or Register). If a valid token cookie is detected, it automatically redirects them to the home page.
export const redirectIfAuthenticated = (request: Request) => {
  const cookieHeaders = request.headers.get("Cookie") || ""
  if (cookieHeaders.includes("token=")) {
    return redirect("/")
  }
  return null
}

//Utility helper to fetch authenticated user profile data from the Express backend. Automatically forwards session cookies from the client request for authentication validation
export const fetchUserData = async (request: Request) => {
  const cookieHeaders = request.headers.get("Cookie") || ""
  const res = await fetch("http://localhost:5000/profile", {
    headers: {
      Cookie: cookieHeaders,
      "Content-Type": "application/json"
    },
    credentials: "include"
  })
  if (
    res.status === 401 ||
    res.status === 403 ||
    res.status === 402
  ) {
    return redirect("/login")
  }
  let serverResponse = (await res.json()) as {
    data: {
      _id: string
      username: string
      avatar: string
      email?: string
      isVerified?: boolean
    }
  }
  return serverResponse.data
}

// This function validates the password complexity and matching criteria on the frontend before submission.
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
) => {
  const errors: Record<string, { _errors: string[] }> = {}
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
  return errors
}
