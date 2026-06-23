//Profile configuration status(ranks, badges,etc)
import { type ProfileBadgeProps } from "~/types/types"
export const defaultProfileBadges: ProfileBadgeProps[] = [
  {
    name: "Classic Mode",
    bgColor: "bg-purple-900/60",
    textColor: "text-purple-300",
    borderColor: "border-purple-700"
  },
  {
    name: "Advanced Mode",
    bgColor: "bg-amber-900/60",
    textColor: "text-amber-300",
    borderColor: "border-amber-700"
  },
  {
    name: "Verified",
    bgColor: "bg-green-900/60",
    textColor: "text-green-300",
    borderColor: "border-green-700"
  }
]
