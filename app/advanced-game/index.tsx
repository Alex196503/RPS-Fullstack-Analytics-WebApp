import { GameBadge } from "~/components/PlayFileComponents/GameBadge"
import { type Route } from "../routes/+types/home"
import { GameBadges } from "~/config/gameConfig"
import { ModalRules } from "../components/PlayFileComponents/ModalRules"
import { useState } from "react"
import { GameDuel } from "~/components/PlayFileComponents/GameDuel"
import { useOutletContext } from "react-router"
import type { GameOutletContextProps } from "~/types/types"
import { motion } from "motion/react"
import useMenuResponsiveClose, {
  useRandomDelayedIndex
} from "../utils/custom-hooks"
import { resetContext } from "~/utils/context"
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Custom game playing background" },
    { name: "description", content: "Welcome to my game interface" }
  ]
}
let menu = "advanced" as const
export default function AdvancedGame() {
  const { isMenuOpen, setMenuOpen, setScore, score } =
    useOutletContext<GameOutletContextProps>()
  useMenuResponsiveClose(isMenuOpen, setMenuOpen)
  const [choice, setChoice] = useState("")
  const [message, setMessage] = useState("")
  let indexChoice = GameBadges.findIndex(
    (badge) => badge.name.toLowerCase() === choice.toLowerCase()
  )
  const [houseChoiceIndex, setHouseChoice] = useState<number | null>(
    null
  )
  useRandomDelayedIndex(choice, setHouseChoice, GameBadges.length)
  return (
    <resetContext.Provider
      value={{ setChoice, setHouseChoice, setMessage }}
    >
      {isMenuOpen && (
        <ModalRules
          name="Rules-Advanced"
          setMenuOpen={setMenuOpen}
          isMenuOpen={isMenuOpen}
          menu={menu}
        />
      )}
      <main className="w-full md:mt-2 py-4 px-3">
        <motion.div
          className={`w-full max-w-[550px] mx-auto ${choice.length > 0 ? "hidden" : "block"}`}
          id="big-container"
          initial={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <section className="flex w-full mx-auto gap-x-8 md:gap-x-0 mt-10 md:mt-5 max-w-[350px] md:max-w-[400px] px-2 py-6 items-center justify-between">
            {GameBadges.slice(1, 2).map((badge) => {
              return (
                <GameBadge
                  item={badge}
                  menu={menu}
                  key={badge.container.id}
                  onClick={() => setChoice(badge.name)}
                />
              )
            })}
          </section>
          <section className="flex w-full max-w-[600px] mx-auto items-center justify-between">
            {GameBadges.slice(3, 4).map((badge) => {
              return (
                <GameBadge
                  item={badge}
                  menu={menu}
                  key={badge.container.id}
                  onClick={() => setChoice(badge.name)}
                />
              )
            })}
            {GameBadges.slice(0, 1).map((badge) => {
              return (
                <GameBadge
                  item={badge}
                  menu={menu}
                  key={badge.container.id}
                  onClick={() => setChoice(badge.name)}
                />
              )
            })}
          </section>
          <section className="flex mb-10 ml-3 w-full py-10 justify-between px-10">
            {GameBadges.slice(4, 5).map((badge) => {
              return (
                <GameBadge
                  item={badge}
                  menu={menu}
                  key={badge.container.id}
                  onClick={() => setChoice(badge.name)}
                />
              )
            })}
            {GameBadges.slice(2, 3).map((badge) => {
              return (
                <GameBadge
                  item={badge}
                  menu={menu}
                  key={badge.container.id}
                  onClick={() => setChoice(badge.name)}
                />
              )
            })}
          </section>
        </motion.div>
        <GameDuel
          HouseChoice={houseChoiceIndex}
          menu="classic"
          indexChoice={indexChoice}
          choice={choice}
          GameBadges={GameBadges}
          message={message}
          setMessage={setMessage}
          score={score}
          setScore={setScore}
        />
      </main>
    </resetContext.Provider>
  )
}
