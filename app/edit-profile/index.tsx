import { Navbar } from "~/components/MainFileComponents/Navbar"
import { EmailInput } from "~/components/RegisterComponents/EmailInput"
import { PasswordInput } from "~/components/RegisterComponents/PasswordInput"
import { TextInput } from "~/components/RegisterComponents/TextInput"
import type { Route } from "./+types"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import type { EditProfileResponse, InitialData } from "~/types/types"
import { useState } from "react"
import { Link } from "react-router"
import { fetchUserData } from "~/utils/frontend-boilerplate/auth-utils"
import {
  handleAvatarChange,
  hasNoProfileChanges
} from "~/utils/frontend-boilerplate/profile-utils"
export async function loader({ request }: { request: Request }) {
  return await fetchUserData(request)
}

export default function EditProfile({
  loaderData
}: Route.ComponentProps) {
  let { username, avatar, email } = loaderData as InitialData
  let [currentEmail, setCurrentEmail] = useState(email || "")
  let [currentUsername, setCurrentUsername] = useState(username || "")
  let [currentAvatar, setCurrentAvatar] = useState(avatar || "")
  let [currentPassword, setCurrentPassword] = useState("")
  let [selectedFile, setSelectedFile] = useState<File | null>(null)
  let [formErrors, setFormErrors] = useState<
    Record<string, string[]>
  >({})

  //Function to reset the form fields to their initial values when the user clicks the cancel button.
  const handleCancel = () => {
    setCurrentEmail(email || "")
    setCurrentUsername(username || "")
    setCurrentAvatar(avatar || "")
    setCurrentPassword("")
    setSelectedFile(null)
    setFormErrors({})
  }

  //Function to send data to the backend, with a PUT request to the edit route
  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormErrors({})

    //Calling the function that checks if there are any changes made to the profile form fields. If no changes are detected, it shows an info toast message and prevents the form submission.

    const validation = hasNoProfileChanges(
      currentUsername,
      username,
      currentEmail,
      email,
      currentPassword,
      selectedFile
    )
    if (validation.shouldStop) {
      return { success: false, errors: null }
    }

    const formData = new FormData()
    formData.append("username", currentUsername)
    formData.append("email", currentEmail)
    if (selectedFile) {
      formData.append("avatar", selectedFile)
    }
    if (currentPassword) {
      formData.append("password", currentPassword)
    }
    try {
      const req = await fetch("http://localhost:5000/profile/edit", {
        method: "PUT",
        body: formData,
        credentials: "include"
      })
      const res = (await req.json()) as EditProfileResponse
      if (!req.ok) {
        if (res.errors) {
          setFormErrors(res.errors)
        } else if (res.message) {
          toast.error(res.message, {
            position: "top-right",
            autoClose: 3000
          })
        }
        return {
          success: false,
          errors: res.errors || { server: res.message }
        }
      }
      if (res.success) {
        toast.success(res.message, {
          position: "top-right",
          autoClose: 3000
        })
      }
      return {
        success: true,
        errors: null,
        data: res
      }
    } catch (err) {
      return {
        success: false,
        errors: {
          global: "Could not connect to the authentication server."
        }
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className="w-full max-w-md mx-auto bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-6 mt-10 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Edit Profile Settings
        </h2>
        <form className="flex flex-col gap-y-4" onSubmit={sendData}>
          <div className="flex flex-col items-center gap-y-3 mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500 bg-gray-800 flex items-center justify-center">
                {currentAvatar ? (
                  <img
                    src={
                      currentAvatar.startsWith("data:")
                        ? currentAvatar
                        : `http://localhost:5000/uploads/${currentAvatar}`
                    }
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">
                    No Avatar
                  </span>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-xs font-semibold"
                >
                  Change Photo
                </label>
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleAvatarChange(
                    e,
                    setCurrentAvatar,
                    setSelectedFile
                  )
                }
              />
            </div>
            <p className="text-xs text-gray-400">
              Click avatar to upload a new image
            </p>
          </div>
          <div className="flex flex-col gap-y-4">
            <TextInput
              label="Username"
              name="username"
              placeholder="Enter your username"
              value={currentUsername}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentUsername(e.target.value)
              }
            />
            {formErrors.username && (
              <span className="text-xs text-red-500 px-1 font-medium">
                {formErrors.username[0]}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-y-5">
            <EmailInput
              label="Email"
              name="email"
              placeholder="Enter your email"
              value={currentEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentEmail(e.target.value)
              }
            />
            {formErrors.email && (
              <span className="text-xs text-red-500 px-1 font-medium">
                {formErrors.email[0]}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1.5">
            <div className="flex justify-center items-center">
              <span className="text-xs text-gray-500 font-bold">
                Leave blank to keep current password
              </span>
            </div>
            <PasswordInput
              label="Password"
              name="password"
              required={false}
              placeholder="Enter your new password"
              value={currentPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentPassword(e.target.value)
              }
            />
            {formErrors.password && (
              <span className="text-xs text-red-500 px-1 font-medium">
                {formErrors.password[0]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-x-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-1/2 py-2.5 bg-gray-800 hover:bg-gray-700 active:scale-95 text-sm font-semibold rounded-lg border border-gray-700 transition duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-sm font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition duration-200 cursor-pointer text-center"
            >
              Save Changes
            </button>
          </div>
        </form>
        <section className="mx-auto mt-6 text-center">
          <Link
            to="/"
            className="text-indigo-500 hover:text-indigo-400 duration-300 transition-colors text-sm font-medium ease-in-out"
          >
            Go back
          </Link>
        </section>
      </div>
      <ToastContainer />
    </>
  )
}
