import { Navbar } from "~/components/MainFileComponents/Navbar"
import type { Route } from "../+types/root"
import LogoBonus from "../images/image-victor.jpg"
import { Link } from "react-router"
import { ProfileViewContainer } from "~/components/ProfileFileComponents/ProfileViewContainer"
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Game app" },
    { name: "description", content: "Welcome to my game interface" }
  ]
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center h-screen">
        <section className="flex flex-col w-full px-4 py-6 text-center">
          <h1 className="text-3xl text-white font-bold">
            Welcome to the Game App, Alex
          </h1>
          <p className="text-lg text-white mt-4">
            Play Rock, Paper, Scissors with a twist!
          </p>
        </section>
        <ProfileViewContainer />
      </main>
    </>
  )
}
