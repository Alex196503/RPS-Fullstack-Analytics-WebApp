import { data } from "react-router"
import { type Express } from "express"
import { app } from "../../server/server"
import request from "supertest"
import {
  describe,
  afterEach,
  expect,
  vi,
  vitest,
  test,
  beforeEach
} from "vitest"
import type { UserProps } from "~/types/auth-user-types"
import { UserModel } from "~/schemas/UserSchema"
import {
  getSessionCookie,
  makePostRequest,
  updateProfileRequest
} from "../backend-boilerplate/backend-functions"
import path from "path"
import { genSalt } from "bcrypt"
import {
  bcrypt_mocked,
  mocked_user,
  mocked_user_model
} from "./test-mocks/user-mocks"
//File that contains Express Backend Integration Tests via Supertest

describe("Test suite validating the profile /GET method", () => {
  ;(test("test that should return data about the user profile", async () => {
    let sessionCookie = await getSessionCookie(app)
    const response = await request(app)
      .get("/profile")
      .set("Accept", "application/json")
      .set("Cookie", sessionCookie as string[])
    expect(response.status).toBe(200)
    let answer = response.body as {
      success: boolean
      message: string
      data: UserProps
    }
    expect(Object.keys(answer).length).toBeGreaterThan(0)
    expect(answer.data.email).toEqual("alexmoldovan2009@gmail.com")
    expect(answer.message).toEqual("User found!")
  }),
    test("test that should return unauthorized 401 if cookie is missing", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Accept", "application/json")
      let success = response.body.success as boolean
      expect(response.status).toBe(401)
      expect(success).toBeFalsy()
      expect(response.body.message).toEqual("Token not provided!")
    }))
})

describe("Test suite validating the authentication route", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  ;(test("test that should return an HTTP 200 status when the login is successful", async () => {
    const res = await makePostRequest(app, "/api/login", {
      email: process.env.GMAIL_USER,
      password: process.env.TEST_PASSWORD
    })
    expect(res.status).toBe(200)
    expect(res.body.success).toBeTruthy()
    expect(res.body.token).not.toBeUndefined()
  }),
    test("test that should return an HTTP Unauthorized when the user is not found", async () => {
      vi.mocked(UserModel.findOne).mockResolvedValue(null)
      const res = await makePostRequest(app, "/api/login", {
        email: "alexmoldovan2002@gmail.com",
        password: process.env.TEST_PASSWORD
      })
      expect(res.status).toBe(404)
      expect(res.body.success).toBeFalsy()
      expect(res.body.token).toBeUndefined()
    }))
})

//Creating some puppet functions for the bcrypt functionality and for the UserModel
vi.mock("bcrypt", async () => {
  const { bcrypt_mocked } = await import("./test-mocks/user-mocks")
  return {
    default: bcrypt_mocked
  }
})

vi.mock("~/schemas/UserSchema", async () => {
  const { mocked_user_model } =
    await import("./test-mocks/user-mocks")
  return {
    UserModel: mocked_user_model
  }
})

describe("Test suite validating the profile /PUT method", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(UserModel.findOne).mockResolvedValue(mocked_user as any)
    vi.mocked(UserModel.findById).mockResolvedValue(mocked_user)
    vi.mocked(UserModel.findByIdAndUpdate).mockResolvedValue({})
  })
  const testImagePath = path.join(
    __dirname,
    "test-images",
    "antimadrid.PNG"
  )
  ;((test("test that should update the user and return an HTTP 200 status when all fields are completed", async () => {
    const sessionCookie = (await getSessionCookie(app)) as string[]
    const res = await updateProfileRequest(
      app,
      { avatarPath: testImagePath },
      sessionCookie
    )
    expect(res.status).toBe(200)
    expect(res.body.success).toBeTruthy()
    expect(res.body.message).toEqual("Profile updated successfully!")
  }),
  test("test that should return an HTTP 400 status when we send an invalid email", async () => {
    const sessionCookie = (await getSessionCookie(app)) as string[]
    const res = await updateProfileRequest(
      app,
      {
        avatarPath: testImagePath,
        email: "alex2009@gmailcom"
      },
      sessionCookie
    )
    expect(res.status).toBe(400)
    expect(res.body.success).toBeFalsy()
    expect(Object.keys(res.body.errors).length).toBeGreaterThan(0)
  })),
    test("test that should return an HTTP 401 status if the server doesn't find the user in our database", async () => {
      vi.mocked(UserModel.findById).mockResolvedValue(null)
      const sessionCookie = (await getSessionCookie(app)) as string[]
      const res = await updateProfileRequest(
        app,
        {
          email: "sandumoldovan2009@gmail.com",
          avatarPath: testImagePath
        },
        sessionCookie
      )
      expect(res.status).toBe(401)
      expect(res.body.success).toBeFalsy()
      expect(res.body.message).toEqual("User not found")
    }))
})
