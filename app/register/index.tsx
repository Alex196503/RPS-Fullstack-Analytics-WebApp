import { Link, redirect } from "react-router"
import { Form } from "react-router"
import { fetchAuthenticationApi } from "~/utils/boilerplate-functions"
import type { Route } from "./+types"
import { EmailInput } from "~/components/RegisterComponents/EmailInput"
import { validateFrontendRegistration } from "~/utils/boilerplate-functions"
import { TextInput } from "~/components/RegisterComponents/TextInput"
import { UploadInput } from "~/components/RegisterComponents/UploadInput"
import { PasswordInput } from "~/components/RegisterComponents/PasswordInput"
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

  //Calling the utility function to make the API call to the authentication server for registration.
  const result = await fetchAuthenticationApi(
    "http://localhost:5000/api/register",
    formData
  )
  if (!result.success) {
    return {
      errors: result.errors
    }
  }
  return redirect("/login")
}
export default function RegisterPage({
  actionData
}: Route.ComponentProps) {
  return (
    <div className="h-auto md:min-h-screen flex items-center justify-center bg-gray-950 px-4 py-6 sm:py-16">
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

          <UploadInput label="Profile Avatar" name="avatar" />
          <PasswordInput
            label="Password"
            name="password"
            placeholder="password length : 6+ chars, at least 1 letter and 1 number"
            minLength={6}
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
          />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Introduce your password again"
            minLength={6}
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
          />
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-sm font-bold uppercase tracking-wider rounded-md shadow-lg transition-all duration-150"
            >
              Register Now
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
