// File with game logic functions that are used in the game components.

import { historicalCities, prefixes } from "~/config/historyConfig"

export type StreakGameInput = {
  result: string
}

//Function to get a random index between a min and max value, inclusive.
export function getRandomIndex(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

//Calculate user rank based on some stats provided by the database
export function calculateRank(
  totalWins: number,
  numberOfAdvancedGames: number,
  numberOfClassicGames: number,
  totalGames: number
) {
  let rank = "Rookie Gladiator"
  let emoji = "🥉"
  if (totalWins >= 50) {
    rank = "Diamond Legend"
    emoji = "💎"
  } else if (totalWins >= 11) {
    rank = "Gold Master"
    emoji = "🥇"
  } else if (numberOfAdvancedGames > 10) {
    rank = "Advanced Strategist"
    emoji = "⚡"
  } else if (
    totalGames > 20 &&
    numberOfClassicGames / totalGames > 0.9
  ) {
    rank = "Classic Purist"
    emoji = "🪵"
  }
  return { rank, emoji }
}

//Helper function to calculate user's current streak based on his games
export function calculateStreak(recentGames: StreakGameInput[]) {
  let currentStreak = 0
  for (let games of recentGames) {
    if (games.result?.toLowerCase() === "win") {
      currentStreak++
    } else break
  }
  return currentStreak
}

//Helper function to build some names for the matches based on some existing prefixes and cities
export function buildNameMatches() {
  const prefixChosen =
    prefixes[Math.floor(Math.random() * prefixes.length)]
  const cityChosen =
    historicalCities[
      Math.floor(Math.random() * historicalCities.length)
    ]
  return { prefixChosen, cityChosen }
}
