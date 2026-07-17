import { Link, useLoaderData } from "react-router"
export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  if (!token) {
    return { success: false, message: "Missing verification token." }
  }
  try {
    const cookie = request.headers.get("Cookie") || ""

    //We use `process.env.BACKEND_API_URL` instead of Vite's `import.meta.env` because this specific block executes exclusively on the server-side (SSR).
    const backendUrl =
      process?.env?.BACKEND_API_URL ||
      process?.env?.VITE_API_URL ||
      import.meta?.env?.BACKEND_API_URL ||
      import.meta?.env?.VITE_API_URL ||
      "https://rps-fullstack-analytics-webapp-1.onrender.com"
    let req = await fetch(
      `${backendUrl}/api/verify-email?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie
        }
      }
    )
    const data = (await req.json()) as {
      success: boolean
      message: string
      isLoggedIn?: boolean
    }
    return {
      success: req.ok && data.success,
      message: data.message,
      isLoggedIn: data.isLoggedIn || false
    }
  } catch (err) {
    console.error("Verification error", err)
    return {
      success: false,
      message: "Could not connect to the server."
    }
  }
}
export default function VerifyEmail() {
  const { success, message, isLoggedIn } =
    useLoaderData<typeof loader>()
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 px-4">
      <section className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-center flex flex-col items-center gap-y-5">
        {success ? (
          <>
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-3xl text-emerald-400 animate-bounce">
              ✅
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Email Verified!
            </h1>
            <p className="text-slate-400 text-sm">{message}</p>
            {!isLoggedIn ? (
              <Link
                to="/login"
                className="mt-2 w-full px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold uppercase text-xs tracking-wider rounded-lg shadow-lg active:scale-95 transition-all"
              >
                Go to Login
              </Link>
            ) : (
              <Link
                to="/"
                className="mt-2 w-full px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold uppercase text-xs tracking-wider rounded-lg shadow-lg active:scale-95 transition-all"
              >
                Go to Dashboard / Home
              </Link>
            )}
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center text-3xl text-rose-400">
              ❌
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Verification Failed
            </h1>
            <p className="text-rose-400 text-sm bg-rose-950/30 border border-rose-900/40 px-3 py-2 rounded-lg w-full">
              {message || "The link is invalid or has expired."}
            </p>
            <Link
              to="/register"
              className="mt-2 w-full px-5 py-2.5 bg-slate-800 hover:bg-slate-700 font-bold uppercase text-xs tracking-wider rounded-lg border border-slate-700 transition-all"
            >
              Go back
            </Link>
          </>
        )}
      </section>
    </main>
  )
}
