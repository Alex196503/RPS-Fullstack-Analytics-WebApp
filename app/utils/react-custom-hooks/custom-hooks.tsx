import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useMemo
} from "react"
import { gameRules } from "~/config/gameConfig"
import { resetContext } from "../react-context/context"
import { ToggleThemeContext } from "../react-context/context"
import { toast } from "react-toastify"
import { sendCSVFileToServer } from "../frontend-boilerplate/frontend-functions"
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

//Custom hook to consume the theme context
export function useThemeContext() {
  const context = useContext(ToggleThemeContext)
  if (!context) {
    throw new Error(
      `This context does not exist was not used properly!`
    )
  }
  return context
}

//Custom Hook for handling CSV file imports with dynamic toast notifications. Wraps `handleImport` in `useCallback` to ensure the function reference remains stable
export const useCSVImport = () => {
  const toastIdRef = useRef<string | number | null>(null)

  const handleImport = useCallback(async (file: File) => {
    toastIdRef.current = toast.loading("Importing the CSV file...")
    try {
      const baseUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000"
      let data = await sendCSVFileToServer(
        `${baseUrl}/match/import`,
        file
      )
      toast.update(toastIdRef.current, {
        render: data.message,
        type: data.success ? "success" : "error",
        isLoading: false,
        autoClose: 5000
      })
    } catch (error) {
      console.error("Upload error", error)
      if (toastIdRef.current) {
        toast.update(toastIdRef.current, {
          render: "Something went wrong with the network!",
          type: "error",
          isLoading: false,
          autoClose: 3000
        })
      }
    } finally {
      toastIdRef.current = null
    }
  }, [])
  return { handleImport }
}

//Custom hook to format timestamps into counts of games played during different times of the day.
export const useChartData = (timeStamps: Date[] | undefined) => {
  const gamesByPeriod = useMemo(() => {
    if (!timeStamps) return [0, 0, 0, 0]
    let morningGames = 0
    let midDayGames = 0
    let eveningGames = 0
    let nightGames = 0
    timeStamps.forEach((timestamp) => {
      let date = new Date(timestamp)
      const hour = date.getHours()
      if (hour >= 6 && hour < 12) {
        morningGames++
      } else if (hour >= 12 && hour < 18) {
        midDayGames++
      } else if (hour >= 18 && hour < 24) {
        eveningGames++
      } else {
        nightGames++
      }
    })
    return [morningGames, midDayGames, eveningGames, nightGames]
  }, [timeStamps])
  return { gamesByPeriod }
}

//Custom hook to calculate the progression of the win rate over time based on match outcomes.
export const useStatsResult = (results: string[] | undefined) => {
  const winRateResults = useMemo(() => {
    if (!results) return []
    let wins = 0
    return results.map((result, index) => {
      if (result === "win") {
        wins++
      }
      let winRate = wins / (index + 1)
      return Number((winRate * 100).toFixed(2))
    })
  }, [results])
  return { winRateResults }
}
