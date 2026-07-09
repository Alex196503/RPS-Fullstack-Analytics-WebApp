import {
  describe,
  afterEach,
  expect,
  vi,
  vitest,
  test,
  beforeEach
} from "vitest"
import { fetchAuthenticationApi } from "../frontend-boilerplate/frontend-functions"
import { toast } from "react-toastify"
import { hasNoProfileChanges } from "../frontend-boilerplate/profile-utils"

//Integration and unit tests for the main client-side authentication API utility. Covers both successful requests (happy path) and server/validation error handlings.
describe("Testing our main API boilerplate function", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })
  test("test function that should return success true when API is ok", async () => {
    let link = "/api/reset/password"
    let payload = {
      password: "alex1234!",
      confirmPassword: "alex1234!",
      token: "secret_token1352156"
    }
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: "Password updated succesfully! "
      })
    } as Response)
    const result = await fetchAuthenticationApi(link, payload)
    expect(result.success).toBeTruthy()
    expect(result.errors).toBeNull()
    expect(result.data.data).toContain("updated")
  })

  test("test function that should return an error when an user that is not logged tries to access our route", async () => {
    let link = "/api/reset/password"
    let payload = {
      password: "alex1234!",
      confirmPassword: "alex1234",
      token: ""
    }
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        errors: "Token not found"
      })
    } as Response)
    const result = await fetchAuthenticationApi(link, payload)
    expect(result.success).not.toBeTruthy()
    expect(result.errors).not.toBeNull()
    expect(result.errors).toContain("not")
  })

  test("test function that should return an error if passwords do not match", async () => {
    let link = "/api/reset/password"
    let payload = {
      password: "alex1234!",
      confirmPassword: "alex1234",
      token: "valid_token_here"
    }
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        errors: ["Passwords do not match"]
      })
    } as Response)
    const result = await fetchAuthenticationApi(link, payload)
    expect(result.success).toBeFalsy()
    expect(result.errors).not.toBeNull()
    expect(result.errors).toContain("Passwords do not match")
  })
})

//These lines of code help Vitest to intercept/catch the library and to convert it into a spy
vi.mock("react-toastify", () => ({
  toast: {
    info: vi.fn()
  }
}))

//Unit tests used to test our function that decides if the user has changed something on his profile in the specific form
describe("Mock tests on the function that makes changes on the user's profile", async () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("should return shouldStop true and trigger toast when no changes to the profile are made", () => {
    const result = hasNoProfileChanges(
      "alex123",
      "alex123",
      "alex@test.com",
      "alex@test.com",
      "",
      null
    )
    expect(result.shouldStop).toBeTruthy()
    expect(result.hasChanges).toBeFalsy()
    expect(toast.info).toHaveBeenCalledWith(
      "No changes made to the profile.",
      expect.objectContaining({ position: "top-right" })
    )
  })

  test("should return hasChanges true and not trigger toast when the username changes", () => {
    const result = hasNoProfileChanges(
      "alex1234",
      "alex123",
      "alex@test.com",
      "alex@test.com",
      "",
      null
    )
    expect(result.hasChanges).toBeTruthy()
    expect(result.shouldStop).toBeFalsy()
    expect(toast.info).not.toHaveBeenCalled()
  })
})
