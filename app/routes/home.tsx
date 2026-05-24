import type { Route } from "./+types/home"
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Game app" },
    { name: "description", content: "Welcome to my game interface" }
  ]
}

export default function Home() {
  return <h2> Hello </h2>
}
