import LogoBonus from "../../images/image-victor.jpg"
import { Form, Link } from "react-router"
import { defaultProfileBadges } from "~/config/profileConfig"
import { ProfileBadgeList } from "./ProfileBadgesShowUp"
import type { UserProps } from "~/types/types"
export const ProfileViewContainer = ({
  data
}: {
  data: UserProps
}) => {
  let { username, createdAt, avatar, email } = data
  const handleDeleteProfile = async () => {
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
        const data = await res.json()
        if (data.success) {
          window.location.href = "/login"
        } else {
          alert(data.message || "Failed to delete profile.")
        }
      } catch (err) {
        console.error("Delete error:", err)
        alert("Failed to connect to server")
      }
    }
  }
  return (
    <>
      <section className="w-full max-w-xl mx-auto px-6 py-8 bg-gray-800 flex flex-col items-center gap-y-4 h-auto rounded-lg shadow-lg text-white">
        <div className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg overflow-hidden flex items-center justify-center bg-gray-700">
          <img
            src={
              avatar
                ? `http://localhost:5000/uploads/${avatar}`
                : LogoBonus
            }
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-2xl font-bold tracking-wide mt-2">
          {username}
        </h3>
        <span className="text-sm font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/50 px-3 py-1 rounded-full border border-blue-900">
          Advanced Strategist
        </span>
        <div className="flex gap-2 mt-2">
          {defaultProfileBadges.map((badge, index) => (
            <ProfileBadgeList key={badge.name} badge={badge} />
          ))}
        </div>
        <p className="text-xs font-bold text-gray-500 mt-5">
          Email: {email}
        </p>
        <p className="text-xs text-gray-400 mt-4 italic">
          Member since:{" "}
          {new Date(createdAt).toLocaleDateString("ro-RO", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </p>
        <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center mt-5">
          <Form action="/edit" method="POST">
            <button
              type="submit"
              className="mt-6 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-sm font-bold uppercase tracking-wider rounded-md shadow-md hover:shadow-blue-500/20 transition-all duration-200 text-center"
            >
              Edit your profile
            </button>
          </Form>
          <button
            type="button"
            onClick={handleDeleteProfile}
            className="mt-6 px-5 py-2.5 w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-95 text-sm font-bold uppercase tracking-wider rounded-md shadow-md hover:shadow-red-500/20 transition-all duration-200 text-center cursor-pointer whitespace-nowrap"
          >
            {" "}
            Delete your profile{" "}
          </button>
        </div>
      </section>
    </>
  )
}
