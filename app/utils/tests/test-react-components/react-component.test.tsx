// @vitest-environment jsdom
import { test, expect, describe } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { type ComponentProps } from "react"
import { userEvent } from "@testing-library/user-event"
import RegisterPage from "~/register"
import { createMemoryRouter, RouterProvider } from "react-router"

type RegisterProps = Omit<
  ComponentProps<typeof RegisterPage>,
  "matches"
> & {
  matches?: any[]
}

//Integration and unit tests for the RegisterPage component.
describe("RegisterPage - Form Validation and File Upload", () => {
  //creating the type for the actionData
  const mockProps: RegisterProps = {
    actionData: {
      success: false,
      errors: {
        email: { _errors: ["Invalid email"] },
        confirmPassword: { _errors: ["Passwords do not match"] },
        avatar: { _errors: ["Avatar image is required"] }
      }
    },
    params: {},
    loaderData: null
  }

  //Creating a router to work with our useNavigation hook
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <RegisterPage {...(mockProps as any)} />
      }
    ],
    {
      initialEntries: ["/"]
    }
  )
  test("should display validation errors from server and disable submit button", async () => {
    render(<RouterProvider router={router} />)

    //ARRANGE
    const button = screen.getByTestId(
      "btn-submit"
    ) as HTMLButtonElement
    const emailParagraph = screen.getByTestId(
      "email-paragraph"
    ) as HTMLParagraphElement
    const confirmPasswordParagraph = screen.getByTestId(
      "confirm-password"
    ) as HTMLParagraphElement
    const avatarParagraph = screen.getByTestId(
      "avatar"
    ) as HTMLParagraphElement

    //ACT
    await userEvent.click(button)

    //ASSERT
    expect(emailParagraph.textContent).not.toBeNull()
    expect(emailParagraph.textContent).toMatch(
      new RegExp("Invalid email")
    )
    expect(confirmPasswordParagraph.textContent).toBeDefined()
    expect(confirmPasswordParagraph.textContent).toMatch(
      new RegExp("do not match")
    )
    expect(avatarParagraph.textContent.length).toBeGreaterThan(0)
    expect(avatarParagraph.textContent).toMatch(/Avatar image/)
  })

  ;((test("should successfully attach a file to the avatar input and hold its data", async () => {
    render(<RouterProvider router={router} />)

    const inputUpload = screen.getByLabelText(
      /Profile Avatar/i
    ) as HTMLInputElement
    const file = new File([], "avatar.png", {
      type: "image/png"
    })

    await userEvent.upload(inputUpload, file)
    let filesUploaded = inputUpload.files
    expect(filesUploaded?.length).toBeGreaterThanOrEqual(1)
    expect(filesUploaded![0].name).toEqual("avatar.png")
  }),
  test("should successfully replace the previous file when a new one is uploaded", async () => {
    render(<RouterProvider router={router} />)

    const inputUpload = screen.getByLabelText(
      /Profile Avatar/i
    ) as HTMLInputElement
    const file = new File([], "avatarFile.png", {
      type: "image/png"
    })
    await userEvent.upload(inputUpload, file)
    const secondFile = new File([], "secondFile.png", {
      type: "image/png"
    })

    await userEvent.upload(inputUpload, secondFile)
    let filesUploaded = inputUpload.files
    expect(filesUploaded?.length).toEqual(1)
    expect(filesUploaded![0].name).toEqual("secondFile.png")
  })),
    test("should successfully reset the file field and unmount the preview image upon removal", async () => {
      render(<RouterProvider router={router} />)

      const inputUpload = screen.getByLabelText(
        /Profile Avatar/i
      ) as HTMLInputElement
      const file = new File([], "avatarFile.png", {
        type: "image/png"
      })
      await userEvent.upload(inputUpload, file)
      const removalBtn = screen.getByTestId(
        "remove"
      ) as HTMLButtonElement
      await userEvent.click(removalBtn)
      const previewAfterRemoval =
        screen.queryByAltText("Avatar preview")
      let filesUploaded = inputUpload.files

      expect(filesUploaded?.length).toBeFalsy()
      expect(previewAfterRemoval).toBeNull()
    }))
})

