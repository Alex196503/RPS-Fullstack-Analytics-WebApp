//History functionality configuration constants(move emojis, configuration object for match outcomes)

//A dictionary that maps move names (stored in the database) to their corresponding UI emojis.
export const moveEmojis: Record<string, string> = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
  lizard: "🦎",
  spock: "🖖"
}

//Object that defines the required design contract for every possible match outcome
export const statusStyles = {
  win: {
    cardBorder:
      "border-emerald-500/30 hover:border-emerald-500/50 shadow-emerald-950/20",
    glowBg: "bg-emerald-500/5",
    badgeText: "Win 🔥",
    badgeClass:
      "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-emerald-950",
    bounceUserMove: "animate-bounce"
  },
  loss: {
    cardBorder:
      "border-rose-500/20 hover:border-rose-500/40 shadow-rose-950/10",
    glowBg: "bg-rose-500/5",
    badgeText: "Loss",
    badgeClass: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    bounceUserMove: ""
  },
  draw: {
    cardBorder:
      "border-slate-700/40 hover:border-slate-600 shadow-none",
    glowBg: "hidden",
    badgeText: "Draw",
    badgeClass: "text-slate-400 bg-slate-800 border-slate-700",
    bounceUserMove: ""
  }
}

//A collection of iconic historical cities used to dynamically generate unique names for each match location along with event prefixes.
export const historicalCities = [
  "Rome",
  "Köln",
  "Bucharest",
  "Athens",
  "Paris",
  "London",
  "Vienna",
  "Berlin",
  "Madrid",
  "Tokyo",
  "Cairo",
  "Kyoto"
]
export const prefixes = [
  "The Battle of",
  "The Clash at",
  "The Siege of",
  "The Showdown in"
]
