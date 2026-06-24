import LogoBonus from "../../images/image-victor.jpg"
import { Link, useLoaderData } from "react-router"
import { defaultProfileBadges } from "~/config/profileConfig"
import { ProfileBadgeList } from "./ProfileBadgesShowUp"
import type { UserProps } from "~/types/types"
import { type StatsResponse } from "~/types/types"
import { toast, ToastContainer } from "react-toastify"
import { handleDeleteProfile } from "~/utils/frontend-boilerplate/profile-utils"
export const ProfileViewContainer = ({
  data
}: {
  data: UserProps
}) => {
  let loaderData = useLoaderData() as {
    user: UserProps
    stats: StatsResponse["data"] | null
  }
  let { username, createdAt, avatar, email, isVerified } = data
  let serverStats = loaderData?.stats
  let numberOfAdvancedGames = loaderData.stats?.stats.advanced
  let numberOfClassicGames = loaderData.stats?.stats.classic
  let totalWins = loaderData.stats?.stats.totalWins

  const sendMailValidation = async (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault()
    try {
      const res = await fetch(
        "http://localhost:5000/api/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        }
      )
      const data = (await res.json()) as {
        success: boolean
        message: string
      }
      if (res.ok && data.success) {
        toast.success(data.message)
      } else {
        toast.error(`Something went wrong! ${data.message}`)
      }
    } catch (err) {
      console.error("Error resending verification:", err)
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
        {!isVerified && (
          <section className="w-full mt-2 text-center flex flex-col items-center gap-y-1 bg-rose-950/40 border border-rose-900/50 p-3 rounded-lg">
            <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-x-1.5">
              Account Not Fully Verified!
            </h3>
            <p className="text-xs text-gray-400 max-w-sm">
              Some premium features like charts and CSV exports are
              locked.
            </p>
            <a
              onClick={sendMailValidation}
              className="text-xs font-bold cursor cursor-pointer text-blue-400 hover:text-blue-300 underline mt-1 transition-colors"
            >
              Click here to check verification status or enter token
            </a>
          </section>
        )}
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
              isVerified={isVerified as boolean}
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
        <ToastContainer position="top-right" autoClose={3000} />
      </section>
    </>
  )
}
