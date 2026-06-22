import { TitleComponents } from "~/components/PlayFileComponents/GameLogoText"
import { ScoreContainer } from "~/components/PlayFileComponents/StatBox"
import { Outlet, useLocation } from "react-router"
import { gameFunctions } from "~/config/gameConfig"
import { Navbar } from "~/components/MainFileComponents/Navbar"
import type { Route } from "../+types/root"
import type { ScoreDBResponse } from "~/types/types"

//Dynamic loader that extracts user score from the DB, identifying the game mode based on the current URL
export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeaders = request.headers.get("Cookie") || ""
  const url = new URL(request.url)
  const isAdvancedPage = url.pathname.includes("advanced")
  const gameMode = isAdvancedPage ? "advanced" : "classic"
  try {
    let req = await fetch("http://localhost:5000/score", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeaders
      },
      credentials: "include"
    })
    if (req.status === 401 || req.status === 403) {
      console.log("User not logged in! Returning score 0!")
      return 0
    }
    if (!req.ok) {
      throw new Error(
        `Something bad happened with the request! ${req.statusText}`
      )
    }
    const resData = (await req.json()) as ScoreDBResponse
    const finalScore = resData.scores[gameMode].totalScore
    return finalScore
  } catch (error) {
    console.error(error)
    return 0
  }
}

export default function HeaderLayout({
  loaderData
}: Route.ComponentProps) {
  let url = useLocation()
  const score = (loaderData ?? 0) as number
  let dynamicGameFunctions: string[]
  if (url.pathname.toLowerCase().includes("advanced")) {
    dynamicGameFunctions = gameFunctions.slice()
  } else {
    dynamicGameFunctions = gameFunctions.slice(0, 3)
  }
  return (
    <>
      <header className="w-full flex flex-col">
        <Navbar />
        <div className="w-full flex justify-between items-center max-w-[350px] sm:max-w-[400px] md:max-w-[700px] border-3 border-gray-600 px-3 py-1 mt-10 rounded-2xl mx-auto">
          <TitleComponents components={dynamicGameFunctions} />
          <ScoreContainer title="Score" value={score} />
        </div>
      </header>
      <Outlet />
    </>
  )
}
