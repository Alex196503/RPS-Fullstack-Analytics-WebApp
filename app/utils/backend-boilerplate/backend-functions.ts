// This file contains back-end boilerplate functions that can be used across the application.
import request from "supertest"
import { type Express } from "express"
import { type HydratedDocument, type InferSchemaType } from "mongoose"
import { UserModel } from "~/schemas/UserSchema"
import type { UpdateProfileOptions } from "~/types/auth-user-types"

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

//Helper function to send an asynchronous HTTP POST request using Supertest and automates setting the request headers and sending the payload JSON data.
export const makePostRequest = async <T>(
  application: Express,
  link: string,
  userData: T
) => {
  return await request(application)
    .post(link)
    .set("Accept", "application/json")
    .send(userData as object)
}

// Log in a test user using environment credentials and return the session cookie.
export const getSessionCookie = async (application: Express) => {
  const loginResponse = await request(application)
    .post("/api/login")
    .send({
      email: process.env.GMAIL_USER,
      password: process.env.TEST_PASSWORD
    })
  return loginResponse.headers["set-cookie"] || []
}

//Helper to send a multipart/form-data PUT request to test the profile edit endpoint. Uses default successful values unless specific overrides are provided.
export const updateProfileRequest = async (
  app: Express,
  overrides: UpdateProfileOptions = {},
  sessionCookie: string[]
) => {
  const username =
    overrides.username ?? (process.env.TEST_USERNAME || "darkista")
  const email =
    overrides.email ?? (process.env.GMAIL_USER || "alex@test.com")
  const password =
    overrides.password ??
    (process.env.TEST_PASSWORD || "TestPassword1")
  const avatarPath = overrides.avatarPath
  const req = request(app)
    .put("/profile/edit")
    .set("Cookie", sessionCookie)
    .field("username", username)
    .field("email", email)
    .field("password", password)

  if (avatarPath) {
    return await req.attach("avatar", avatarPath)
  }
  return await req
}
