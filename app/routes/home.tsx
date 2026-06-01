import { Navbar } from "~/components/MainFileComponents/Navbar"
import type { Route } from "../+types/root"
import { redirect } from "react-router"
import { ProfileViewContainer } from "~/components/ProfileFileComponents/ProfileViewContainer"
import type { UserProps } from "~/types/types"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Game app" },
    { name: "description", content: "Welcome to my game interface" }
  ]
}

//Function that redirects the user to the login page if he is not logged in based on the api response, that checks if the user has got a jwt token
export async function loader({ request }: { request: Request }) {
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
  let serverResponse = await res.json()
  return serverResponse.data
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const data = (loaderData || {}) as UserProps
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center h-screen">
        <section className="flex flex-col w-full px-4 py-6 text-center">
          <h1 className="text-3xl text-white font-bold">
            Welcome to the Game App, {data.username}
          </h1>
          <p className="text-lg text-white mt-4">
            Play Rock, Paper, Scissors with a twist!
          </p>
        </section>
        <ProfileViewContainer data={data} />
      </main>
    </>
  )
}
