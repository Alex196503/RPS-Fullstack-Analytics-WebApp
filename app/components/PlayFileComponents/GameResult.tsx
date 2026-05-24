import {
  type ContextResetProps,
  type GameResultContainerProps
} from "~/types/types"
import { useResetContext, useResultGame } from "~/utils/custom-hooks"

export const GameResult = ({
  message,
  HouseChoiceMessage,
  choice,
  setMessage
}: GameResultContainerProps) => {
  useResultGame(HouseChoiceMessage, choice, setMessage)

  //Consuming the reset context
  const context = useResetContext()
  const { setChoice, setHouseChoice } = context
  const resetGame = () => {
    setChoice("")
    setHouseChoice(null)
    setMessage("");
  }
  return (
    <div className="flex flex-col w-full items-center px-4 py-5 mt-2 order-3 md:order-none">
      <h3 className="text-4xl text-white font-bold tracking-wide py-4 uppercase ">
        {message}
      </h3>
      <button
        type="button"
        className="bg-white cursor-pointer text-red-600 font-bold tracking-wide py-2 px-12 rounded-lg hover:bg-gray-200 transition-colors duration-300"
        onClick={resetGame}
      >
        Play Again
      </button>
    </div>
  )
}
