import LogoBonus from "../../images/image-victor.jpg"
import { Link } from "react-router"
import { defaultProfileBadges } from "~/config/profileConfig"
import { ProfileBadgeList } from "./ProfileBadgesShowUp"
export const ProfileViewContainer = () => {
  return (
    <>
      <section className="w-full max-w-xl mx-auto px-6 py-8 bg-gray-800 flex flex-col items-center gap-y-4 h-auto rounded-lg shadow-lg text-white">
        <div className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg overflow-hidden flex items-center justify-center bg-gray-700">
          <img
            src={LogoBonus}
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-2xl font-bold tracking-wide mt-2">
          AlexGamer234
        </h3>
        <span className="text-sm font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/50 px-3 py-1 rounded-full border border-blue-900">
          Advanced Strategist
        </span>
        <div className="flex gap-2 mt-2">
          {defaultProfileBadges.map((badge, index) => (
            <ProfileBadgeList key={badge.name} badge={badge}/>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4 italic">
          Member from: May 2026
        </p>
        <Link
          to="/profile"
          className="mt-6 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-sm font-bold uppercase tracking-wider rounded-md shadow-md hover:shadow-blue-500/20 transition-all duration-200 text-center"
        >
          Edit your profile
        </Link>
      </section>
    </>
  )
}
