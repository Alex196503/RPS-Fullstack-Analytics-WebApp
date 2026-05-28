import { Form } from "react-router"
import { EmailInput } from "~/components/RegisterComponents/EmailInput"
import { PasswordInput } from "~/components/RegisterComponents/PasswordInput"
import { Link } from "react-router"
import type { Route } from "./+types"
import { redirect } from "react-router"
import {
  fetchAuthenticationApi,
  validateFrontendLogin
} from "~/utils/boilerplate-functions"
export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData()
  let email = formData.get("email") as string
  let password = formData.get("password") as string
  const errors = validateFrontendLogin(email, password)
  if (errors) {
    return { success: false, errors }
  }
  const payload = {
    email,
    password
  }
  //Calling the utility function to make the API call to the authentication server for login.
  const result = await fetchAuthenticationApi(
    "http://localhost:5000/api/login",
    payload
  )
  if (!result.success) {
    return {
      errors: result.errors
    }
  }

  return redirect("/")
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
          <div className="mb-6 px-4 py-5 bg-red-700 text-red-100 text-center rounded-lg border border-red-500 shadow-md">
            {Object.values(actionData?.errors).map((error, index) => (
              <p className="text-sm text-red-400 mt-1" key={index}>
                {index + 1}. {error as string}
              </p>
            ))}
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
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
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
      </div>
    </div>
  )
}
