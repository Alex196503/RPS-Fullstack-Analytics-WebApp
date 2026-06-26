import type { ParameterContainerProps } from "../../types/layout-types"

export const ScoreContainer = ({
  title = "Score",
  value = 12
}: ParameterContainerProps) => {
  return (
    <>
      <div className="w-[110px] md:w-[150px] bg-white rounded-xl text-center flex flex-col justify-center py-4 md:py-6 shadow-sm">
        <h3 className="text-(--color-blue-700) tracking-widest uppercase font-semibold">
          {title}
        </h3>
        <p className="text-(--color-navy-900) text-5xl font-bold">
          {value}
        </p>
      </div>
    </>
  )
}
