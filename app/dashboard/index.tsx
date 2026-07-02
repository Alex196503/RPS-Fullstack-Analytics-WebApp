import { Navbar } from "~/components/MainFileComponents/Navbar"
import type { Route } from "../+types/root"
import { fetchUserData } from "~/utils/frontend-boilerplate/auth-utils"
import { useLoaderData } from "react-router"
import { StatCard } from "~/components/DashboardComponents/StatCard"
import type { StatsResponse } from "~/types/game-types"
import { PieDiagram } from "~/components/DashboardComponents/PieDiagram"
import { useMemo } from "react"
import { LineChartDiagram } from "~/components/DashboardComponents/LineChartDiagram"
import { DashboardCard } from "~/components/DashboardComponents/DashboardCard"
import { BarChartDiagram } from "~/components/DashboardComponents/BarChartDiagram"
import {
  useChartData,
  useStatsResult
} from "~/utils/react-custom-hooks/custom-hooks"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "State page" },
    {
      name: "description",
      content: "Welcome to your stats page"
    }
  ]
}

export async function loader({ request }: Route.ActionArgs) {
  const baseUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  const cookieHeaders = request.headers.get("Cookie") || ""
  try {
    let [userData, statsResponse, requestToStatsCharts] =
      await Promise.all([
        fetchUserData(request),
        fetch(`${baseUrl}/match/stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookieHeaders
          },
          credentials: "include"
        }),
        fetch(`${baseUrl}/match/rank`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookieHeaders
          }
        })
      ])
    if (userData instanceof Response) {
      return userData
    }
    if (!statsResponse.ok) {
      const errorData = (await statsResponse.json()) as {
        message: string
        success: boolean
      }
      throw new Error(`Something bad happened! ${errorData.message}`)
    }

    const userStats = (await statsResponse.json()) as {
      success: boolean
      stats: {
        title: string
        value: number | string
        unitOfMeasure: string
      }[]
      results: string[]
      timeStamps: NativeDate[]
    }

    let chartStats = null
    if (requestToStatsCharts.ok) {
      const parsedStats =
        (await requestToStatsCharts.json()) as StatsResponse
      chartStats = parsedStats.data
    }
    return {
      user: userData,
      statsData: userStats,
      chartStats,
      errorMessage: null
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Could not connect to the server ${err}`)
    }
    return {
      user: null,
      statsData: null,
      chartStats: null,
      errorMessage:
        err instanceof Error
          ? err.message
          : "Failed to load dashboard data."
    }
  }
}

export default function Dashboard() {
  let { user, statsData, chartStats } = useLoaderData<typeof loader>()
  let timeStamps = statsData?.timeStamps
  let matchOutcomes = statsData?.results
  const { gamesByPeriod } = useChartData(timeStamps)
  const { winRateResults } = useStatsResult(matchOutcomes)
  let diagramLabels = ["Total wins", "Total draws", "Total losses"]
  let chartStatsArray = [
    chartStats?.stats.totalWins,
    chartStats?.stats.totalDraws,
    chartStats?.stats?.totalLosses
  ] as number[]
  let labels: string[] = []
  statsData?.results?.forEach((match, index) => {
    labels.push(`Match #${index + 1}`)
  })

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <header className="mb-8 flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Game Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time statistics and match history analytics.
            </p>
          </div>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsData?.stats.map((stat, index) => {
            return (
              <StatCard
                key={index}
                value={stat.value}
                title={stat.title}
                unitOfMeasure={stat.unitOfMeasure}
              />
            )
          })}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Wins-Losses-Draws Ratio"
            description="Pie chart that surprises the ratio of these 3"
          >
            <PieDiagram
              labels={diagramLabels}
              chartStats={chartStatsArray}
            />
          </DashboardCard>
          <DashboardCard
            title="Performance History"
            description="Win progression over the last matches"
            className="lg:col-span-2"
          >
            <LineChartDiagram
              labels={labels}
              results={winRateResults}
            />
          </DashboardCard>
          <DashboardCard
            title="Time of day"
            description="Bar chart graphic that shows when the user has been playing the most"
            className="lg:col-span-3"
          >
            <BarChartDiagram
              labels={[
                "Morning (6-12)",
                "Midday (12-18)",
                "Evening (18-24)",
                "Night (0-6)"
              ]}
              barValues={gamesByPeriod as number[]}
            />
          </DashboardCard>
        </section>
      </div>
    </>
  )
}
