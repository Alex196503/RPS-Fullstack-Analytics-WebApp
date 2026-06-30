import { Form } from "react-router"
import { EmailInput } from "~/components/RegisterComponents/EmailInput"
import { PasswordInput } from "~/components/RegisterComponents/PasswordInput"
import { Link } from "react-router"
import type { Route } from "./+types"
import { redirect } from "react-router"

import { fetchAuthenticationApi } from "~/utils/frontend-boilerplate/frontend-functions"
import {
  redirectIfAuthenticated,
  validateFrontendLogin
} from "~/utils/frontend-boilerplate/auth-utils"
export async function loader({ request }: Route.ActionArgs) {
  //Calling the function which checks if the users are logged in or not
  return redirectIfAuthenticated(request)
}
export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData()
  let email = formData.get("email") as string
  let password = formData.get("password") as string
  const errors = validateFrontendLogin(email, password)
  if (errors) {
    return { success: false, errors }
  }
  const payload = { email, password }
  const baseUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  const result = await fetchAuthenticationApi(
    `${baseUrl}/api/login`,
    payload
  )

  if (!result || result.success === false || !result.data) {
    return {
      success: false,
      errors: result?.errors || {
        server: "Invalid email or password!"
      }
    }
  }

  // Set the JWT token in an HTTP-only cookie on the frontend domain via response headers This ensures the token is available to subsequent server-side loaders during React Router's revalidation phase.
  return redirect("/", {
    headers: {
      "Set-Cookie": `token=${result.data.token}; Path=/; HttpOnly; Max-Age=3600; SameSite=Lax`
    }
  })
}
export default function LoginPage({
  actionData
}: Route.ComponentProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl text-white">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to your account to continue playing
          </p>
        </div>
        {actionData?.errors && (
          <div className="mb-6 px-4 py-5 bg-red-700 flex flex-col gap-2 text-red-100 text-center rounded-lg border border-red-500 shadow-md">
            {actionData?.errors?.email?._errors?.[0] && (
              <p className="text-sm font-semibold text-white">
                Email: {actionData.errors.email._errors[0]}
              </p>
            )}

            {actionData?.errors?.password?._errors?.[0] && (
              <p className="text-sm font-semibold text-white">
                Password: {actionData.errors.password._errors[0]}
              </p>
            )}

            {actionData?.errors?.server && (
              <p className="text-sm font-semibold text-white">
                {actionData.errors.server}
              </p>
            )}

            {typeof actionData?.errors === "string" && (
              <p className="text-sm font-semibold text-white">
                {actionData.errors}
              </p>
            )}
          </div>
        )}
        <Form
          noValidate
          className="mt-8 flex flex-col gap-y-4"
          method="POST"
        >
          <EmailInput
            label="Email Address"
            name="email"
            placeholder="you@example.com"
          />

          <PasswordInput
            label="Password"
            name="password"
            placeholder="Enter your password"
          />

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-sm font-bold uppercase tracking-wider rounded-md shadow-lg transition-all duration-150"
            >
              Sign In
            </button>
          </div>
        </Form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
          >
            Register a new account
          </Link>
        </p>
        <p className="text-center text-sm text-gray-200 mt-4">
          <Link
            to="/forgot-password"
            className="font-medium text-blue-300 hover:text-blue-700 cursor-pointer transition-colors duration-300"
          >
            Forgot password? Reset it
          </Link>
        </p>
      </div>
    </div>
  )
}
