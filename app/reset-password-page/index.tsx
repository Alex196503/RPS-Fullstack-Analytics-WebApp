import { Form, redirect, useActionData } from "react-router"
import { PasswordInput } from "~/components/RegisterComponents/PasswordInput"
import { Link } from "react-router"
import { useEffect, useState } from "react"
import type { Route } from "./+types"
import { validatePasswordMatch } from "~/utils/frontend-boilerplate/auth-utils"
import { fetchAuthenticationApi } from "~/utils/frontend-boilerplate/frontend-functions"
import { toast, ToastContainer } from "react-toastify"
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  if (!token) {
    return redirect("/login?token=notFound")
  }
}
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const url = new URL(request.url)
  const token = url.searchParams.get("token") || ""
  if (!token) {
    return { success: false, message: "Missing verification token." }
  }
  try {
    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")
    let passwordErrors = validatePasswordMatch(
      password as string,
      confirmPassword as string
    )
    if (Object.keys(passwordErrors).length > 0) {
      return { success: false, errors: passwordErrors }
    }
    const objectPayload = Object.fromEntries(
      formData.entries()
    ) as Record<string, string>
    objectPayload.token = token
    const baseUrl =
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    let req = await fetchAuthenticationApi(
      `${baseUrl}/api/reset-password`,
      objectPayload
    )
    if (!req.success) {
      const cleanErrorMessage =
        typeof req.errors === "string"
          ? req.errors
          : (req.errors as any)?.server ||
            (req.errors as any)?.global ||
            "Invalid or expired link."
      return {
        serverErrors: cleanErrorMessage,
        success: false
      }
    }
    const successMessage =
      typeof req.data === "string"
        ? req.data
        : (req.data as any)?.message ||
          "Password updated successfully!"
    return {
      message: successMessage,
      success: true
    }
  } catch (err) {
    console.error(`Failed to connect to the server: ${err}`)
    return { success: false, serverErrors: "Connection failed!" }
  }
}

export default function ResetPasswordPage() {
  const actionData = useActionData<typeof action>()
  let [isMounted, setMounted] = useState(false)

  // Mount use efect to prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])
  const errors = actionData?.errors
  const serverError = actionData?.serverErrors
  useEffect(() => {
    if (!actionData) return
    if (actionData.serverErrors) {
      let serverErrorOccured =
        actionData.serverErrors ||
        "Something bad occured on the server!"
      toast.error(serverErrorOccured)
    } else if (actionData.message) {
      let successMessage =
        actionData?.message ||
        "Password updated succesfully! You can now authenticate with your new password!"
      toast.success(successMessage)
    }
  }, [actionData])
  return (
    <section className="min-h-dvh w-full flex items-center justify-center bg-gray-950 px-4 py-8">
      <div className="w-full max-w-md space-y-6 bg-gray-900 p-5 sm:p-8 rounded-xl border border-gray-800 shadow-2xl text-white">
        <h1 className="text-white font-medium text-xl text-left py-1 tracking-wider">
          Change your password
        </h1>
        {serverError && (
          <div className="mb-4 px-4 py-3 bg-red-950 text-red-400 text-sm font-medium text-left rounded-lg border border-red-800/60 shadow-inner">
            <span className="font-bold text-red-300">Error:</span>{" "}
            {serverError}
          </div>
        )}
        {errors && (
          <div className="mb-6 px-4 py-5 bg-red-700 flex flex-col gap-2 text-red-100 text-left rounded-lg border border-red-500 shadow-md">
            {errors.password?._errors?.[0] && (
              <p className="text-sm font-medium text-red-400">
                <span className="font-bold text-red-300">
                  Password:
                </span>{" "}
                {errors.password._errors[0]}
              </p>
            )}
            {errors.confirmPassword?._errors?.[0] && (
              <p className="text-sm font-medium text-red-400">
                <span className="font-bold text-red-300">
                  Confirm Password:
                </span>{" "}
                {errors.confirmPassword._errors[0]}
              </p>
            )}
          </div>
        )}
        <Form noValidate className="mt-3" method="POST">
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
            <button type="submit" className="btn-submit">
              Update password
            </button>
          </div>
        </Form>
        <section className="flex items-center justify-center mt-2">
          <Link
            to="/login"
            className="font-medium text-cyan-500 hover:text-cyan-300 duration-300 ease-in-out transition-colors underline underline-offset-4"
          >
            Go back
          </Link>
        </section>
      </div>
      {isMounted && (
        <ToastContainer
          position="top-right"
          autoClose={5000}
          closeOnClick={true}
        />
      )}
    </section>
  )
}
