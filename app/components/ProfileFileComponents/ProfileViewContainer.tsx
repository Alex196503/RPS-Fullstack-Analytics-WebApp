import LogoBonus from "../../images/image-victor.jpg"
import { Link, useLoaderData } from "react-router"
import { defaultProfileBadges } from "~/config/profileConfig"
import { ProfileBadgeList } from "./ProfileBadgesShowUp"
import type { UserProps } from "~/types/types"
import { type StatsResponse } from "~/types/types"
export const ProfileViewContainer = ({
  data
}: {
  data: UserProps
}) => {
  let loaderData = useLoaderData() as {
    user: UserProps
    stats: StatsResponse["data"] | null
  }
  let { username, createdAt, avatar, email } = data
  let serverStats = loaderData?.stats
  let numberOfAdvancedGames = loaderData.stats?.stats.advanced
  let numberOfClassicGames = loaderData.stats?.stats.classic
  let totalWins = loaderData.stats?.stats.totalWins
  const handleDeleteProfile = async () => {
    let userConfirmation = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    )
    if (userConfirmation) {
      try {
        const res = await fetch(
          "http://localhost:5000/profile/delete",
          {
            method: "POST",
            credentials: "include"
          }
        )
        const data = (await res.json()) as {
          success: boolean
          message?: string
        }
        if (data.success) {
          window.location.href = "/login?deleted=true"
        } else {
          alert(data.message || "Failed to delete profile.")
        }
      } catch (err) {
        console.error("Delete error:", err)
        alert("Failed to connect to server")
      }
    }
  }
  return (
    <>
      <section className="w-full max-w-xl mx-auto px-6 py-8 bg-gray-800 flex flex-col items-center gap-y-4 h-auto rounded-lg shadow-lg text-white">
        <div className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg overflow-hidden flex items-center justify-center bg-gray-700">
          <img
            src={
              avatar
                ? `http://localhost:5000/uploads/${avatar}`
                : LogoBonus
            }
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-2xl font-bold tracking-wide mt-2">
          {username}
        </h3>
        {serverStats ? (
          <span className="text-sm font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/50 px-3 py-1 rounded-full border border-amber-900 flex items-center gap-x-1.5 animate-pulse">
            <span>{serverStats.emoji}</span>
            {serverStats.rank}
          </span>
        ) : (
          <span className="text-xs text-gray-400">
            No rank data available
          </span>
        )}
        <div className="flex gap-2 mt-2">
          {defaultProfileBadges.map((badge, index) => (
            <ProfileBadgeList
              stats={
                [
                  numberOfAdvancedGames,
                  numberOfClassicGames
                ] as number[]
              }
              key={badge.name}
              badge={badge}
            />
          ))}
        </div>
        <div className="flex items-center gap-x-3 px-4 py-2 bg-slate-900/60 border border-slate-700/50 rounded-xl shadow-inner mt-2">
          <span className="text-xl">🏆</span>
          <h3 className="text-sm text-slate-300 font-semibold tracking-wide">
            Total Wins:{" "}
            <span className="text-base font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
              {totalWins}
            </span>
          </h3>
        </div>
        <p className="text-xs font-bold text-gray-500 mt-2">
          Email: {email}
        </p>
        <p className="text-xs text-gray-400 mt-2 italic">
          Member since:{" "}
          {new Date(createdAt || Date.now()).toLocaleDateString(
            "ro-RO",
            {
              year: "numeric",
              month: "long",
              day: "numeric"
            }
          )}
        </p>
        <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center mt-5">
          <Link
            to="/profile"
            className="mt-6 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-sm font-bold uppercase tracking-wider rounded-md shadow-md hover:shadow-blue-500/20 transition-all duration-200 text-center"
          >
            Edit your profile
          </Link>
          <button
            type="button"
            onClick={handleDeleteProfile}
            className="mt-6 px-5 py-2.5 w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-95 text-sm font-bold uppercase tracking-wider rounded-md shadow-md hover:shadow-red-500/20 transition-all duration-200 text-center cursor-pointer whitespace-nowrap"
          >
            {" "}
            Delete your profile{" "}
          </button>
        </div>
      </section>
    </>
  )
}
