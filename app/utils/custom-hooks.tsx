import { useContext, useEffect } from "react"
import { gameRules } from "~/config/gameConfig"
import { resetContext } from "./context"
import { ToggleThemeContext } from "./context"
// Custom hook to close the menu when the window is resized above a certain width e.g. 750px
export default function useMenuResponsiveClose(
  isMenuOpen: boolean,
  setMenuOpen: (value: React.SetStateAction<boolean>) => void
) {
  useEffect(() => {
    const resizer = () => {
      let currWindow = window.innerWidth
      if (currWindow > 750) {
        setMenuOpen(false)
      }
    }
    window.addEventListener("resize", resizer)
    return () => {
      window.removeEventListener("resize", resizer)
    }
  }, [isMenuOpen])
}

//Custom hook that triggers a delayed random index selection based on a trigger condition. Useful for simulating computer/house selections in games after a specific countdown.
export function useRandomDelayedIndex(
  choice: string,
  setHouseChoice: (
    value: React.SetStateAction<number | null>
  ) => void,
  limit = 3
) {
  useEffect(() => {
    if (choice.length > 0) {
      const myTimeout = setTimeout(() => {
        let randomIndex = Math.floor(Math.random() * limit)
        if (randomIndex !== -1) {
          setHouseChoice(randomIndex)
        }
      }, 3000)
      return () => {
        clearTimeout(myTimeout)
      }
    }
  }, [choice])
}

//Custom hook that monitors the player's and house's choices, evaluates the game rules, and updates the game outcome message state. Employs a guard clause to wait until both sides have made a selection. */
export function useResultGame(
  HouseChoiceMessage: string | null,
  choice: string,
  setMessage: (value: React.SetStateAction<string>) => void
) {
  useEffect(() => {
    if (!HouseChoiceMessage || !choice) return
    if (HouseChoiceMessage === choice.toLowerCase()) {
      setMessage("It's a tie!")
    } else {
      let playerWin = gameRules.find((rule) => rule.win === choice)
      if (
        playerWin &&
        playerWin.lose.includes(HouseChoiceMessage.toLowerCase())
      ) {
        setMessage("You win!")
      } else {
        setMessage("You lost!")
      }
    }
  }, [HouseChoiceMessage, choice, setMessage])
}

// Custom hook to safely consume the reset context.
export function useResetContext() {
  const context = useContext(resetContext)
  if (!context) {
    throw new Error(
      `Reset context does not exist or was not created properly!`
    )
  }
  return context
}

export function useThemeContext() {
  const context = useContext(ToggleThemeContext)
  if (!context) {
    throw new Error(
      `This context does not exist was not used properly!`
    )
  }
  return context
}
