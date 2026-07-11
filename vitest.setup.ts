import { vi } from "vitest"
//setup config file to ensure react router works with react testing library
;(globalThis as any).__reactRouterContext = {}

//global mock for our react components
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>()
  return {
    ...actual,
    Form: "form",
    Link: "a",
    NavLink: "a"
  }
})
