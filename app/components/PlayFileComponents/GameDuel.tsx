import type { GameDuelProps } from "~/types/types"
import { GameBadge } from "./GameBadge"
import { GameBadges, gameFunctions } from "~/config/gameConfig"
import { motion } from "framer-motion"
import { GameResult } from "./GameResult"
import { useRevalidator } from "react-router"
import { WinnerGlow } from "./WinnerGlow"
import { useEffect } from "react"
import { parseGameOutcome } from "~/utils/frontend-boilerplate/frontend-functions"
export const GameDuel = ({
  indexChoice,
  menu = "classic",
  choice,
  HouseChoice,
  message,
  setMessage
}: GameDuelProps) => {
  let HouseChoiceMessage =
    HouseChoice !== null
      ? gameFunctions[HouseChoice].toLowerCase()
      : null
  let isPlayerWinner = message.toLowerCase().includes("win")
  let isHouseWinner = message.toLowerCase().includes("lost")

  //useRevalidator hook used to execute all the active loaders to bring data freshly from the DB, without having to reload the page in the browser
  let validate = useRevalidator()

  useEffect(() => {
    if (!message) return
    let cleanOutcome = parseGameOutcome(message)

    if (cleanOutcome) {
      fetch("http://localhost:5000/score/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          outcome: cleanOutcome,
          gamemode: menu
        })
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `Error caused from the server: ${res.statusText}`
            )
          }
          return res.json()
        })
        .then((data) => {
          validate.revalidate()
          console.log("Request succedeed! Score saved into DB!", data)
        })
        .catch((err) => {
          console.error(
            "Something bad happened with the request",
            err
          )
        })
    }
  }, [message, menu])

  return (
    <motion.section
      className={`w-full max-w-[360px] md:max-w-[750px] flex-wrap md:flex-nowrap mx-auto flex justify-between items-center mt-8 px-4 ${choice.length > 0 ? "flex" : "hidden"}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex w-1/2 flex-col flex-wrap md:flex-nowrap items-center gap-y-4 md:gap-y-7 px-4 py-5 mt-2 order-1 md:order-none">
        <h3 className="paragraph-choice">You Picked</h3>
        {indexChoice !== -1 && (
          <div className="relative z-10">
            {isPlayerWinner && <WinnerGlow />}
            <GameBadge
              item={GameBadges[indexChoice]}
              menu={menu}
              isDuelMode={true}
            />
          </div>
        )}
      </div>
      <GameResult
        message={message}
        HouseChoiceMessage={HouseChoiceMessage}
        choice={choice}
        setMessage={setMessage}
      />
      <div className="flex w-1/2 flex-col items-center px-4 py-5 gap-y-4 md:gap-y-7 mt-2 md:w-auto order-2 md:order-none">
        <h3 className="paragraph-choice">House Picked</h3>
        {HouseChoice !== null ? (
          <div className="relative z-10">
            {isHouseWinner && <WinnerGlow />}
            <GameBadge
              item={GameBadges[HouseChoice]}
              menu={menu}
              isDuelMode={true}
            />
          </div>
        ) : (
          <div className="w-[130px] h-[130px] md:w-[150px] md:h-[150px] bg-black/10 rounded-full"></div>
        )}
      </div>
    </motion.section>
  )
}
