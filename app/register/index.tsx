import { Link, redirect, useNavigation } from "react-router"
import { Form } from "react-router"
import {
  redirectIfAuthenticated,
  validateFrontendRegistration
} from "~/utils/frontend-boilerplate/auth-utils"
import { fetchAuthenticationApi } from "~/utils/frontend-boilerplate/frontend-functions"
import type { Route } from "./+types"
import { EmailInput } from "~/components/RegisterComponents/EmailInput"
import { TextInput } from "~/components/RegisterComponents/TextInput"
import { UploadInput } from "~/components/RegisterComponents/UploadInput"
import { PasswordInput } from "~/components/RegisterComponents/PasswordInput"

export async function loader({ request }: Route.ActionArgs) {
  //Calling the function which checks if the users are logged in or not
  return redirectIfAuthenticated(request)
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const avatarFile = formData.get("avatar") as File | null

  // Calling the front-end validation function to check the form inputs

  let errors = validateFrontendRegistration(
    email,
    password,
    username,
    avatarFile,
    confirmPassword
  )
  if (errors) {
    return { success: false, errors }
  }

  const baseUrl =
    import.meta.env.VITE_API_URL ||
    "https://rps-fullstack-analytics-webapp-1.onrender.com"
  //Calling the utility function to make the API call to the authentication server for registration.
  const result = await fetchAuthenticationApi(
    `${baseUrl}/api/register`,
    formData
  )
  if (!result.success) {
    return {
      errors: result.errors
    }
  }
  throw redirect("/login")
}
export default function RegisterPage({
  actionData
}: Route.ComponentProps) {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"
  return (
    <div className="register-container">
      <div className="w-full max-w-md space-y-6 bg-gray-900 p-5 sm:p-8 rounded-xl border border-gray-800 shadow-2xl text-white">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join the arena and track your game stats
          </p>
        </div>
        {actionData?.errors && (
          <div className="mb-6 px-4 py-5 bg-red-700 flex flex-col gap-2 text-red-100 text-left rounded-lg border border-red-500 shadow-md">
            {(actionData.errors.email?._errors?.[0] ||
              typeof actionData.errors.email === "string") && (
              <p
                data-testid="email-paragraph"
                className="text-sm font-semibold text-white"
              >
                Email:{" "}
                {actionData.errors.email?._errors?.[0] ||
                  actionData.errors.email}
              </p>
            )}

            {(actionData.errors.username?._errors?.[0] ||
              typeof actionData.errors.username === "string") && (
              <p className="text-sm font-semibold text-white">
                Username:{" "}
                {actionData.errors.username?._errors?.[0] ||
                  actionData.errors.username}
              </p>
            )}

            {(actionData.errors.avatar?._errors?.[0] ||
              typeof actionData.errors.avatar === "string") && (
              <p
                data-testid="avatar"
                className="text-sm font-semibold text-white"
              >
                Avatar:{" "}
                {actionData.errors.avatar?._errors?.[0] ||
                  actionData.errors.avatar}
              </p>
            )}

            {(actionData.errors.password?._errors?.[0] ||
              typeof actionData.errors.password === "string") && (
              <p className="text-sm font-semibold text-white">
                Password:{" "}
                {actionData.errors.password?._errors?.[0] ||
                  actionData.errors.password}
              </p>
            )}

            {(actionData.errors.confirmPassword?._errors?.[0] ||
              typeof actionData.errors.confirmPassword ===
                "string") && (
              <p
                data-testid="confirm-password"
                className="text-sm font-semibold text-white"
              >
                Confirm Password:{" "}
                {actionData.errors.confirmPassword?._errors?.[0] ||
                  actionData.errors.confirmPassword}
              </p>
            )}

            {(actionData.errors._errors?.[0] ||
              typeof actionData.errors.server === "string") && (
              <p className="text-sm font-semibold text-white">
                {actionData.errors._errors?.[0] ||
                  actionData.errors.server}
              </p>
            )}
          </div>
        )}
        <Form
          noValidate
          className="mt-8"
          method="POST"
          encType="multipart/form-data"
        >
          <TextInput
            label="Username"
            name="username"
            placeholder="e.g. AlexGamer234"
            minLength={3}
            maxLength={15}
          />
          <div className="form-container">
            <EmailInput
              label="Email Address"
              name="email"
              placeholder="you@example.com"
            />
          </div>

          <UploadInput
            label="Profile Avatar"
            name="avatar"
            accept="image/*"
          />
          <PasswordInput
            label="Password"
            name="password"
            placeholder="password length : 6+ chars, at least 1 letter and 1 number"
            minLength={6}
          />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Introduce your password again"
            minLength={6}
          />
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-submit"
              data-testid="btn-submit"
            >
              {isSubmitting ? "Registering..." : "Register now!"}
            </button>
          </div>
        </Form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}
