import { Navbar } from "~/components/MainFileComponents/Navbar"
import type { Route } from "../+types/root"
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
    </>
  )
}
