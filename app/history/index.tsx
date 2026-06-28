import { Navbar } from "~/components/MainFileComponents/Navbar"
import type { Route } from "../+types/root"
import { fetchUserData } from "~/utils/frontend-boilerplate/auth-utils"
import type { MatchesDBResponse } from "~/types/game-types"
import { redirect, useLoaderData } from "react-router"
import React, { useEffect, useState } from "react"
import MatchCard from "~/components/HistoryComponents/MatchCard"
import { SelectInput } from "~/components/HistoryComponents/SelectInput"
import { SearchBar } from "~/components/HistoryComponents/SearchBar"
import type { UserLoaderSuccess } from "~/types/auth-user-types"
import { toast, ToastContainer } from "react-toastify"
import { fetchHistoryPageData } from "~/utils/frontend-boilerplate/frontend-functions"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "History & Stats page" },
    {
      name: "description",
      content: "Welcome to your history page & stats"
    }
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
  return await fetchHistoryPageData(request)
}

export default function History() {
  let ourMatches = useLoaderData<typeof loader>().matches
  let message = useLoaderData<typeof loader>().errorMessage

  useEffect(() => {
    if (!message) return
    toast.error(message)

    // Clear error query param from URL without reloading the page (params: stateObj, title, url)
    if (typeof window !== "undefined") {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      )
    }
  }, [message])

  const ourLoaderData = useLoaderData<
    typeof loader
  >() as UserLoaderSuccess
  const isUserVerified = ourLoaderData.user?.isVerified
  let [modeFilter, setFilter] = useState("All")
  let [result, setResult] = useState("All")
  let [currentPage, setCurrentPage] = useState(1)
  let [searchValue, setSearchValue] = useState("")
  let filteredMatches = ourMatches.filter((match) => {
    const matchName = match.name || "Arena Match"
    const matchesFilteredByMode =
      modeFilter === "All" || match.mode === modeFilter.toLowerCase()
    const matchesFilteredByResult =
      result === "All" || match.result === result.toLowerCase()
    const searchedMatches =
      searchValue === "" ||
      matchName.toLowerCase().includes(searchValue.toLowerCase())
    return (
      matchesFilteredByMode &&
      matchesFilteredByResult &&
      searchedMatches
    )
  })
  let matchesPerPage = 3
  let indexOfLastPage = matchesPerPage * currentPage
  let indexOfFirstPage = indexOfLastPage - matchesPerPage
  let currentItems = filteredMatches.slice(
    indexOfFirstPage,
    indexOfLastPage
  )
  let totalPages =
    Math.ceil(filteredMatches.length / matchesPerPage) || 1
  return (
    <>
      <Navbar />
      <main className="bg-slate-950 text-slate-100 min-h-screen p-6 font-sans">
        <div className="max-w-3xl mx-auto space-y-6">
          <section className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-bold tracking-wide">
              Match History
            </h1>
            {isUserVerified && (
              <a
                href="http://localhost:5000/match/export"
                className="text-white bg-green-500 box-border border border-transparent hover:bg-green-700 shadow-xs font-medium leading-5 rounded-xl text-xl px-4 py-2.5 focus:outline-none ease-in-out duration-300 cursor-pointer"
              >
                Export CSV
              </a>
            )}
            <span className="text-sm text-slate-400">
              View your {ourMatches.length ?? 0} matches
            </span>
          </section>
          <SearchBar
            label="Search for a match..."
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchValue(e.target.value)
              setCurrentPage(1)
            }}
          />
          <SelectInput
            label="Filter based on the gamemode"
            filter={modeFilter}
            onChange={(e) => {
              setFilter(e.target.value)
              setCurrentPage(1)
            }}
            options={["Advanced", "Classic", "All"]}
          />
          <SelectInput
            label="Filter based on the result"
            filter={result}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setResult(e.target.value)
              setCurrentPage(1)
            }}
            options={["All", "Win", "Draw", "Loss"]}
          />
          <button
            type="reset"
            className="bg-gray-200 text-black font-medium hover:bg-gray-300 cursor-pointer block mx-auto hover:text-shadow-amber-50 duration-300 ease-in-out px-4 py-2 rounded"
            onClick={() => {
              setCurrentPage(1)
              setFilter("All")
              setResult("All")
              setSearchValue("")
            }}
          >
            Reset Form
          </button>
          {currentItems.map((match) => {
            return <MatchCard key={match._id} match={match} />
          })}
          <section className="flex items-center justify-between mt-4 py-3">
            <h3 className="text-white text-xl">
              Showing {currentPage} of {totalPages}{" "}
              {totalPages > 1 ? "pages" : "page"}
            </h3>
            <div className="flex justify-center gap-x-10">
              <button
                type="button"
                disabled={currentPage === 1}
                className="btn-prev"
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <button
                type="button"
                className="btn-next"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </section>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </main>
    </>
  )
}
