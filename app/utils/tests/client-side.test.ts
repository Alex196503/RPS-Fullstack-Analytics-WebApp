import { describe, afterEach, expect, vi, vitest, test } from "vitest"
import { fetchAuthenticationApi } from "../frontend-boilerplate/frontend-functions"

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
