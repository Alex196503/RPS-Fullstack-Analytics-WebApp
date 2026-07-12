import { vi } from "vitest"
import React from "react"
import "@testing-library/jest-dom"
//setup config file to ensure react router works with react testing library
;(globalThis as any).__reactRouterContext = {}

//global mock for our react components
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>()
  return {
    ...actual,
    Link: "a",
    NavLink: "a",
    Form: "form",
    useActionData: vi.fn(() => null),
    useSubmit: vi.fn(() => vi.fn()),
    useNavigation: vi.fn(() => ({ state: "idle" })),
    useOutletContext: vi.fn(() => ({
      isMenuOpen: false,
      setMenuOpen: vi.fn()
    })),
    useRevalidator: vi.fn(() => ({
      revalidate: vi.fn(),
      state: "idle"
    }))
  }
})

//Mocking the react-toastify functionality
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  },
  ToastContainer: () => null
}))
