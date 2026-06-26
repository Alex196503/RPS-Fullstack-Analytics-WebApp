import { Navbar } from "~/components/MainFileComponents/Navbar"
import type { Route } from "../+types/root"
import { ProfileViewContainer } from "~/components/ProfileFileComponents/ProfileViewContainer"
import type { StatsResponse } from "~/types/game-types"
import { type UserProps } from "~/types/auth-user-types"
import { fetchUserData } from "~/utils/frontend-boilerplate/auth-utils"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Game app" },
    { name: "description", content: "Welcome to my game interface" }
  ]
}

//Function that redirects the user to the login page if he is not logged in based on the api response, that checks if the user has got a jwt token
export async function loader({ request }: { request: Request }) {
  try {
    let cookieHeaders = request.headers.get("Cookie") || ""
    const [userData, statsRes] = await Promise.all([
      fetchUserData(request),
      fetch("http://localhost:5000/match/stats", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeaders
        }
      })
    ])
    if (userData instanceof Response) {
      return userData
    }
    let statsData = null
    if (statsRes.ok) {
      const parsedStats = (await statsRes.json()) as StatsResponse
      statsData = parsedStats.data
    }
    return {
      user: userData as UserProps,
      stats: statsData
    }
  } catch (err) {
    console.error("Failed to load loader data in Home:", err)
    return { user: {} as UserProps, stats: null }
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { user, stats } = loaderData || {
    user: {} as UserProps,
    stats: null
  }
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center h-screen">
        <section className="flex flex-col w-full px-4 py-6 text-center">
          <h1 className="text-3xl text-white font-bold">
            Welcome to the Game App, {user.username}
          </h1>
          <p className="text-lg text-white mt-4">
            Play Rock, Paper, Scissors with a twist!
          </p>
        </section>
        <ProfileViewContainer data={user} />
      </main>
    </>
  )
}
