import { type Route } from "../routes/+types/home"
import { GameBadge } from "~/components/PlayFileComponents/GameBadge"
import { GameBadges } from "~/config/gameConfig"

import { ModalRules } from "../components/PlayFileComponents/ModalRules"
import useMenuResponsiveClose, {
  useRandomDelayedIndex
} from "../utils/custom-hooks"
import { useOutletContext } from "react-router"
import type { GameOutletContextProps } from "../types/layout-types"
import { useState } from "react"
import { GameDuel } from "~/components/PlayFileComponents/GameDuel"
import { motion } from "motion/react"
import { resetContext } from "~/utils/context"
import { fetchUserData } from "~/utils/frontend-boilerplate/auth-utils"
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Custom game playing background" },
    { name: "description", content: "Welcome to my game interface" }
  ]
}
let menu = "custom" as const

export async function loader({ request }: Route.ActionArgs) {
  return await fetchUserData(request)
}

export default function GameApp() {
  const { isMenuOpen, setMenuOpen } =
    useOutletContext<GameOutletContextProps>()
  useMenuResponsiveClose(isMenuOpen, setMenuOpen)
  const [choice, setChoice] = useState("")
  const [houseChoiceIndex, setHouseChoice] = useState<number | null>(
    null
  )
  const [message, setMessage] = useState("")

  let indexChoice = GameBadges.findIndex(
    (badge) => badge.name.toLowerCase() === choice.toLowerCase()
  )
  useRandomDelayedIndex(choice, setHouseChoice, 3)
  return (
    <resetContext.Provider
      value={{ setChoice, setHouseChoice, setMessage }}
    >
      {isMenuOpen && (
        <ModalRules
          name="Rules"
          setMenuOpen={setMenuOpen}
          isMenuOpen={isMenuOpen}
          menu={menu}
        />
      )}
      <main className="w-full md:mt-2 py-4 px-3">
        <motion.div
          key="step-1"
          initial={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className={`w-full ${choice.length > 0 ? "hidden" : "block"}`}
          id="big-container"
        >
          <section className="flex w-full mx-auto gap-x-8 md:gap-x-0 mt-10 md:mt-5 max-w-[350px] md:max-w-[400px] mb-5 md:mb-7 px-2 py-6 items-center justify-center">
            {GameBadges.slice(0, 2).map((badge) => {
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
          {GameBadges.slice(2, 3).map((badge) => {
            return (
              <GameBadge
                menu={menu}
                item={badge}
                key={badge.container.id}
                onClick={() => setChoice(badge.name)}
              />
            )
          })}
        </motion.div>
        <GameDuel
          menu="classic"
          indexChoice={indexChoice}
          choice={choice}
          GameBadges={GameBadges}
          HouseChoice={houseChoiceIndex}
          message={message}
          setMessage={setMessage}
        />
      </main>
    </resetContext.Provider>
  )
}
