import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import { Types } from "mongoose"
import { getCombinedDashboardStats } from "~/mongo-aggregations/aggregation-pipeline"
import { MatchModel } from "~/schemas/MatchSchema"
import { UserModel } from "~/schemas/UserSchema"
import type { DashboardFacetResult } from "~/types/game-types"

//Controller method to handle match history reset (deletion of all matches for the authenticated user)
export const resetStats = async (
  req: Request,
  res: Response<{ success: boolean; message: string }>,
  next: NextFunction
) => {
  let idUser = req.user?.user_id
  try {
    const result = await MatchModel.deleteMany({
      user: idUser
    })
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No matches found to reset."
      })
    }
    await UserModel.updateOne(
      { _id: idUser },
      {
        $set: {
          "advancedScore.wins": 0,
          "advancedScore.losses": 0,
          "advancedScore.draws": 0,
          "classicScore.wins": 0,
          "classicScore.losses": 0,
          "classicScore.draws": 0,
          "classicScore.totalScore": 0,
          "advancedScore.totalScore": 0
        }
      }
    )
    return res.status(200).json({
      message: "All matches deleted",
      success: true
    })
  } catch (err) {
    next(err)
  }
}

//Controller method to show some stats about the matches that user has played
export const getMatchStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let idUser = req.user?.user_id
  if (!idUser) {
    return res
      .status(404)
      .json({ message: "User not found!", success: false })
  }
  try {
    let totalMatches = await MatchModel.countDocuments({
      user: idUser
    })
    let totalWins = await MatchModel.countDocuments({
      user: idUser,
      result: "win"
    })

    let WinRate = (
      totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0
    ).toFixed(2)

    //Calculate the current streak of wins for the user
    const allGames = await MatchModel.find({ user: idUser })
      .sort({ createdAt: -1 })
      .select("result createdAt")
      .lean()
    const recentGames = allGames
    const oldestGames = [...(allGames || [])].reverse()
    const timeStamps = allGames.map((game) => game.createdAt)
    let fullResults = oldestGames.map((game) => game.result)
    let currentStreak = 0
    for (let games of recentGames) {
      if (games.result === "win") {
        currentStreak++
      } else break
    }

    const [aggregatedData] = (await MatchModel.aggregate(
      getCombinedDashboardStats(idUser)
    )) as DashboardFacetResult[]
    const mostUsedPlayerMoveResult =
      aggregatedData?.favoriteMoveBranch?.length > 0
        ? aggregatedData.favoriteMoveBranch[0]._id
        : "None"

    const advancedModeRatioResult =
      aggregatedData?.advancedRatioBranch?.length > 0
        ? aggregatedData.advancedRatioBranch[0].advancedPercentage
        : 0
    const statsCards = [
      {
        title: "Total Matches",
        value: totalMatches,
        unitOfMeasure: ""
      },
      {
        title: "Win Rate",
        value: WinRate,
        unitOfMeasure: "%"
      },
      {
        title: "Most used player move",
        value: mostUsedPlayerMoveResult,
        unitOfMeasure: ""
      },
      {
        title: "Advanced Mode Ratio",
        value: advancedModeRatioResult,
        unitOfMeasure: "%"
      },
      {
        title: "Current Streak",
        value: currentStreak,
        unitOfMeasure: "🔥"
      }
    ]
    return res.status(200).json({
      success: true,
      stats: statsCards,
      results: fullResults,
      timeStamps
    })
  } catch (err) {
    next(err)
  }
}
