import { type GameBadgeProps } from "~/types/game-types"

export const GameBadge = ({
  item,
  menu,
  onClick,
  isDuelMode = false
}: GameBadgeProps) => {
  const menuProperties = {
    classic: "",
    advanced: isDuelMode ? "" : item.advancedProperties,
    custom: isDuelMode ? "" : item.customProperties
  }
  const currentProperties = menuProperties[menu]
  return (
    <div
      onClick={onClick}
      style={{
        boxShadow: `0 8px 0 0 var(${item.container.shadowColor})`
      }}
      className={`mx-auto w-[130px] h-[130px] md:w-[150px] md:h-[150px] px-3 py-3 flex items-center justify-center rounded-[50%] ${item.container.bgColor}`}
    >
      <div className={`badge-inner ${currentProperties}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={item.svg.width}
          height={item.svg.height}
          className="svg-class"
          viewBox={`0 0 ${item.svg.width} ${item.svg.height}`}
        >
          <path fill="#1F222F" d={item.svg.path} />
        </svg>
      </div>
    </div>
  )
}
