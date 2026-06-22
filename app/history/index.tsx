import { Navbar } from "~/components/MainFileComponents/Navbar"
import type { Route } from "../+types/root"
import { fetchUserData } from "~/utils/frontend-boilerplate/auth-utils"
import type { MatchesDBResponse } from "~/types/types"
import { useLoaderData } from "react-router"
import MatchCard from "~/components/HistoryComponents/MatchCard"
export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeaders = request.headers.get("Cookie") || ""
  const [user, existingMatches] = await Promise.all([
    fetchUserData(request),
    fetch("http://localhost:5000/match", {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeaders
      },
      credentials: "include"
    })
  ])
  const matchesData =
    (await existingMatches.json()) as MatchesDBResponse
  return {
    user,
    matches: matchesData.data
  }
}

export default function History() {
  let ourMatches = useLoaderData<typeof loader>().matches
  return (
    <>
      <Navbar />
      <main className="bg-slate-950 text-slate-100 min-h-screen p-6 font-sans">
        <div className="max-w-3xl mx-auto space-y-6">
          <section className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-bold tracking-wide">
              Match History
            </h1>
            <span className="text-sm text-slate-400">
              View your {ourMatches.length ?? 0} matches
            </span>
          </section>
          {ourMatches.map((match) => {
            return <MatchCard key={match._id} match={match} />
          })}
        </div>
      </main>
    </>
  )
}
