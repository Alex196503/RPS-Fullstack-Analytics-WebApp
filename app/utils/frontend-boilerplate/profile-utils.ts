import { toast } from "react-toastify"

//Function to change the image of the avatar preview when the user selects a new file.
export const handleAvatarChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setCurrentAvatar: React.Dispatch<React.SetStateAction<string>>,
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>
) => {
  const file = e.target.files?.[0]
  if (file) {
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setCurrentAvatar(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
}

//Function that checks if there are any changes made to the profile form fields. If no changes are detected, it shows an info toast message and prevents the form submission.
export const hasNoProfileChanges = (
  currentUsername: string,
  username: string,
  currentEmail: string,
  email: string,
  currentPassword: string,
  selectedFile: File | null
) => {
  const isUserNameUnchanged = currentUsername === username
  const isEmailUnchanged = currentEmail === email
  const isPasswordEmpty = currentPassword === ""
  const isAvatarUnchanged = selectedFile === null
  if (
    isUserNameUnchanged &&
    isEmailUnchanged &&
    isPasswordEmpty &&
    isAvatarUnchanged
  ) {
    toast.info("No changes made to the profile.", {
      position: "top-right",
      autoClose: 3000
    })
    return { hasChanges: false, shouldStop: true }
  }
  return { hasChanges: true, shouldStop: false }
}

//Function that handles the operation of deleting a profile for an existing user
export const handleDeleteProfile = async () => {
  let userConfirmation = window.confirm(
    "Are you sure you want to delete your profile? This action cannot be undone."
  )
  if (userConfirmation) {
    try {
      const res = await fetch(
        "http://localhost:5000/profile/delete",
        {
          method: "POST",
          credentials: "include"
        }
      )
      const data = (await res.json()) as {
        success: boolean
        message?: string
      }
      if (data.success) {
        window.location.href = "/login?deleted=true"
      } else {
        alert(data.message || "Failed to delete profile.")
      }
    } catch (err) {
      console.error(
        "The delete functionality could not be processed:",
        err
      )
      alert("Failed to connect to server")
    }
  }
}
