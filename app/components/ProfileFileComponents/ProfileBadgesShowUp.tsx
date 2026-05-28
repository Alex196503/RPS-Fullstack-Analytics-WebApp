import type { ProfileBadgeProps } from "~/types/types"

export const ProfileBadgeList = ({
  badge
}: {
  badge: ProfileBadgeProps
}) => {
  return (
    <span
      className={`text-xs ${badge.bgColor} ${badge.textColor} ${badge.borderColor} border px-2.5 py-1 rounded font-medium`}
      key={badge.name}
    >
      {" "}
      {badge.name}{" "}
    </span>
  )
}
