import type { ProfileBadgeProps } from "~/types/types"

export const ProfileBadgeList = ({
  badge,
  stats,
  isVerified
}: {
  badge: ProfileBadgeProps
  stats: number[]
  isVerified: boolean
}) => {
  const isClassic = badge.name.toLowerCase().includes("classic")
  const isAdvanced = badge.name.toLowerCase().includes("advanced")
  const isVerifiedBadge = badge.name
    .toLowerCase()
    .includes("verified")
  let [numberOfAdvancedGames, numberOfClassicGames] = stats
  return (
    <span
      className={`text-xs ${badge.bgColor} ${badge.textColor} ${badge.borderColor} border px-2.5 py-1 rounded font-medium`}
      key={badge.name}
    >
      {" "}
      {badge.name}{" "}
      {isClassic && (
        <span className="text-xs font-bold text-gray-400">
          ({numberOfClassicGames} matches)
        </span>
      )}
      {isAdvanced && (
        <span className="text-xs font-bold text-amber-400">
          ({numberOfAdvancedGames} matches)
        </span>
      )}
      {isVerifiedBadge && <span>{isVerified ? "✅" : "❌"}</span>}
    </span>
  )
}
