import { describe, test, expect } from "vitest"
import { historicalCities, prefixes } from "~/config/historyConfig"
import {
  buildNameMatches,
  calculateRank,
  calculateStreak,
  getRandomIndex
} from "../game-helper-functions/gameHelper"
import { gameRules } from "~/config/gameConfig"
// Test to check if the randomized index function works correctly for various cases.
describe("Get random index", () => {
  test("Check if the randomized index functions works perfectly for every case", () => {
    for (let i = 0; i < 100; i++) {
      let result = getRandomIndex(1, 5)
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(5)
      expect(Number.isInteger(result)).toBeTruthy()
    }
  })
})

//Test to check if our game configuration integrity is correct
describe("Game configuration integrity", () => {
  test("should guarantee all valid game elements are present in the win/lose matrix", () => {
    const allLosers = gameRules.map((rule) => rule.lose).flat()
    let set = new Set(allLosers)
    const elements = ["scissors", "lizard", "rock", "paper", "spock"]
    let areAllPresent = elements.every((element) => set.has(element))
    expect(areAllPresent).toBe(true)
  })
})

// Test suite validating the priority and edge cases of the rank calculation algorithm, the base cases(the minimum conditions) for a player to get a specific rank
describe("Testing the rank calculation logic", () => {
  test.each([
    {
      wins: 50,
      advanced: 0,
      total: 60,
      classic: 60,
      expectedRank: "Diamond Legend"
    },
    {
      wins: 12,
      advanced: 5,
      total: 20,
      classic: 15,
      expectedRank: "Gold Master"
    },
    {
      wins: 5,
      advanced: 11,
      total: 15,
      classic: 3,
      expectedRank: "Advanced Strategist"
    },
    {
      wins: 2,
      advanced: 1,
      total: 25,
      classic: 24,
      expectedRank: "Classic Purist"
    }
  ])(
    "should return $expectedRank for given stats",
    ({ wins, advanced, total, classic, expectedRank }) => {
      const result = calculateRank(wins, advanced, classic, total)
      expect(result.rank).toBe(expectedRank)
    }
  )
})

// Test suite validating the edge cases that can appear in the algorithm that calculates the current streak associated to an user
describe("Test the current streak associated to an user", () => {
  test.each([
    {
      match1: "win",
      match2: "win",
      match3: "win",
      match4: "win",
      expectedCurrentStreak: 4
    },
    {
      match1: "win",
      match2: "loss", // Most recent second game was a loss -> breaks the streak
      match3: "win",
      match4: "win",
      expectedCurrentStreak: 1
    }
  ])(
    "should return $expectedCurrentStreak for both sets of games",
    ({ match1, match2, match3, match4, expectedCurrentStreak }) => {
      const mockGames = [
        { result: match1 },
        { result: match2 },
        { result: match3 },
        { result: match4 }
      ]
      const result = calculateStreak(mockGames)
      expect(result).toBe(expectedCurrentStreak)
    }
  )
})

describe("Testing building name for the matches function", () => {
  test("Checking if the array doesn't show an index out of bound behaviour", () => {
    for (let i = 0; i < 100; i++) {
      let { prefixChosen, cityChosen } = buildNameMatches()
      let prefixIndex = prefixes.indexOf(prefixChosen)
      let cityIndex = historicalCities.indexOf(cityChosen)
      expect(prefixIndex).not.toBe(-1)
      expect(cityIndex).not.toBe(-1)
      expect(prefixIndex).toBeLessThan(prefixes.length)
      expect(cityIndex).toBeLessThan(historicalCities.length)
    }
  })
})
