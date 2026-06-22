import { type GameMatch } from "~/types/types"
import { moveEmojis } from "~/config/historyConfig"
import { statusStyles } from "~/config/historyConfig"

export default function MatchCard({ match }: { match: GameMatch }) {
  const currentStyle = statusStyles[match.result]
  const formattedDate = new Date(match.createdAt).toLocaleDateString(
    "ro-RO",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }
  )
  return (
    <article
      className={`relative cursor-pointer overflow-hidden bg-slate-900 border rounded-xl p-4 shadow-lg transition ${currentStyle.cardBorder}`}
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-5 -mt-5 ${currentStyle.glowBg}`}
      ></div>
      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <span
            className={`px-2.5 py-0.5 text-xs font-black uppercase tracking-wider rounded border ${
              match.mode === "advanced"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
            }`}
          >
            {match.mode}
          </span>
          <p className="text-xs text-slate-400 pt-1">
            {formattedDate}
          </p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <span
              className={`block text-2xl ${currentStyle.bounceUserMove}`}
            >
              {moveEmojis[match.playerMove.toLowerCase()] || "❓"}
            </span>
            <span className="span-player">You</span>
          </div>
          <span className="text-xs font-bold text-slate-600 tracking-widest uppercase">
            VS
          </span>
          <div className="text-center">
            <span className="block text-2xl">
              {moveEmojis[match.opponentMove.toLowerCase()] || "❓"}
            </span>
            <span className="span-player">Computer</span>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`inline-block px-3 py-1 text-sm font-bold border rounded-full uppercase tracking-wider shadow-sm ${currentStyle.badgeClass}`}
          >
            {currentStyle.badgeText}
          </span>
        </div>
      </div>
    </article>
  )
}
