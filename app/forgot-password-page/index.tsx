import { TextInput } from "~/components/RegisterComponents/TextInput"
import { Form, useActionData } from "react-router"
import { fetchAuthenticationApi } from "~/utils/frontend-boilerplate/frontend-functions"
import { toast, ToastContainer } from "react-toastify"
import { useEffect } from "react"
import type { Route } from "../+types/root"
export async function action({ request }: Route.ActionArgs) {
  try {
    let formData = await request.formData()
    let resetField = formData.get("text") as string
    const result = await fetchAuthenticationApi(
      "http://localhost:5000/api/forgot-password",
      { identity: resetField }
    )
    return result
  } catch (err) {
    console.error(`Failed to connect to the server: ${err}`)
    return { success: false, errors: { global: "Connection failed" } }
  }
}
export default function ResetPasswordPage() {
  const actionData = useActionData<typeof action>()
  useEffect(() => {
    if (!actionData) return
    if (actionData?.errors) {
      const errorMessage = (actionData?.errors?.global ||
        actionData?.errors?.server ||
        "An internal error occured!") as string
      toast.error(errorMessage)
    } else {
      const successMessage = (actionData?.data?.message ||
        "A reset mail has been sent to your email!") as string
      toast.success(successMessage)
    }
  }, [actionData])
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md space-y-3 bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl text-white">
        <h3 className="text-xl font-semibold tracking-tight text-white">
          Find your account
        </h3>
        <p className="text-slate-400 text-sm">
          Introduce your email or the username to reset your password
        </p>
        <Form className="space-y-5" method="post">
          <div className="flex flex-col gap-y-2">
            <TextInput
              label="Enter the username or your email"
              name="text"
              placeholder="Introduce the username or the email"
              minLength={5}
              maxLength={40}
            />
          </div>

          <button
            type="submit"
            className="mt-1 w-full px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 font-bold uppercase text-xs tracking-wider rounded-lg shadow-lg active:scale-95 transition-all text-center"
          >
            Send Reset Link
          </button>
        </Form>
        <div className="text-center border-t border-gray-800/60">
          <a
            href="/login"
            className="text-xs font-medium text-slate-400 hover:text-amber-500 transition-colors"
          >
            ← Back to Login
          </a>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick={true}
      />
    </section>
  )
}
