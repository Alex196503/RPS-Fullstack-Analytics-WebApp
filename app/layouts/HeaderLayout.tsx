import { TitleComponents } from "~/components/PlayFileComponents/GameLogoText"
import { ScoreContainer } from "~/components/PlayFileComponents/StatBox"
import { Outlet, useLocation } from "react-router"
import { gameFunctions } from "~/config/gameConfig"
import { useEffect, useState } from "react"
// Pass 'score' from HeaderLayout down to the final layout child. React Router's useOutletContext() only reads from the closest parent, so we must merge Header props with Footer props here to receive all 4 in GameApp.
export default function HeaderLayout() {
  let url = useLocation()
  let dynamicGameFunctions: string[]
  if (url.pathname.toLowerCase().includes("advanced")) {
    dynamicGameFunctions = gameFunctions.slice()
  } else {
    dynamicGameFunctions = gameFunctions.slice(0, 3)
  }
  let [score, setScore] = useState<number>(0)
  useEffect(() => {
    if (typeof window !== "undefined") {
      let score = localStorage.getItem("score")
      if (score) {
        setScore(JSON.parse(score))
      }
    }
  }, [])
  useEffect(() => {
    if (typeof window !== "undefined" && score > 0) {
      localStorage.setItem("score", JSON.stringify(score))
    }
  }, [score])
  return (
    <>
      <header className="w-full flex justify-between items-center max-w-[350px] sm:max-w-[400px] md:max-w-[700px] border-3 border-gray-600 px-3 py-1 mt-10 rounded-2xl mx-auto">
        <TitleComponents components={dynamicGameFunctions} />
        <ScoreContainer title="Score" value={score} />
      </header>
      <Outlet context={{ score, setScore }} />
    </>
  )
}
