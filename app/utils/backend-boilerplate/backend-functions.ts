// This file contains back-end boilerplate functions that can be used across the application.

import { type HydratedDocument, type InferSchemaType } from "mongoose"
import { UserModel } from "~/schemas/UserSchema"

//Function that updates dynamically user score based on the gamemode(classic or advanced), considering the outcome of the game(win, draw or loss)
type UserSchemaType = InferSchemaType<typeof UserModel.schema>
export function updateModeScore(
  userDoc: HydratedDocument<UserSchemaType>,
  mode: string,
  outcome: string
) {
  const scoreKey =
    mode === "classic" ? "classicScore" : "advancedScore"
  if (!userDoc[scoreKey]) {
    userDoc[scoreKey] = {
      wins: 0,
      losses: 0,
      draws: 0,
      totalScore: 0
    }
  }
  const result = outcome.toLowerCase()
  if (result.includes("win")) {
    userDoc[scoreKey].wins += 1
  } else if (result.includes("loss") || result.includes("lost")) {
    userDoc[scoreKey].losses += 1
  } else if (result.includes("draw") || result.includes("tie")) {
    userDoc[scoreKey].draws += 1
  } else {
    throw new Error(
      "Invalid outcome type. Use 'win', 'loss', or 'draw'."
    )
  }
}
