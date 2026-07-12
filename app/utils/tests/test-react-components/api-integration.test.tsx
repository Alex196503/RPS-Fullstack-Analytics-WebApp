// @vitest-environment jsdom
import { test, expect, describe, vi, afterEach } from "vitest"
import { toast, ToastContainer } from "react-toastify"
import {
  fireEvent,
  render,
  screen,
  waitFor
} from "@testing-library/react"
import ResetPasswordPage from "~/reset-password-page"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, useSubmit } from "react-router"
//Integration tests for the resetPassword component


describe("Forgot password page tests - how component behaves when it is dealing with error or success state", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  ;(test("should show green success message to the user when API returns success", async () => {
    const { useActionData } = await import("react-router")

    vi.mocked(useActionData).mockReturnValue({
      success: true,
      message: "Password updated successfully!",
      errors: undefined,
      serverErrors: undefined
    })
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Password updated successfully!"
      )
    })
  }),
    test("should show validation errors when passwords don't match", async () => {
      const { useActionData } = await import("react-router")
      vi.mocked(useActionData).mockReturnValue({
        success: false,
        errors: {
          confirmPassword: {
            _errors: ["Passwords don't match"]
          }
        },
        serverErrors: undefined,
        message: undefined
      })
      render(
        <MemoryRouter>
          <ResetPasswordPage />
        </MemoryRouter>
      )
      expect(
        screen.getByText("Passwords don't match")
      ).toBeInTheDocument()
    }))
})
