import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import { MatchModel } from "~/schemas/MatchSchema"
import { type StatsResponse } from "~/types/game-types"

//Controller method to compute and return user gameplay statistics.
export const getUserStats = async (
  req: Request,
  res: Response<StatsResponse>,
  next: NextFunction
) => {
  let idUser = req.user?.user_id
  try {
    let rank = "Rookie Gladiator"
    let emoji = "🥉"
    let badges: string[] = []
    let [numberOfAdvancedGames, numberOfClassicGames, totalWins] =
      await Promise.all([
        MatchModel.countDocuments({
          user: idUser,
          mode: "advanced"
        }),
        MatchModel.countDocuments({
          user: idUser,
          mode: "classic"
        }),
        MatchModel.countDocuments({ user: idUser, result: "win" })
      ])
    let totalGames = numberOfAdvancedGames + numberOfClassicGames
    if (totalWins >= 50) {
      rank = "Diamond Legend"
      emoji = "💎"
    } else if (totalWins >= 11) {
      rank = "Gold Master"
      emoji = "🥇"
    } else if (numberOfAdvancedGames > 10) {
      rank = "Advanced Strategist"
      emoji = "⚡"
    } else if (
      totalGames > 20 &&
      numberOfClassicGames / totalGames > 0.9
    ) {
      rank = "Classic Purist"
      emoji = "🪵"
    }
    res.status(200).json({
      success: true,
      data: {
        rank,
        emoji,
        badges,
        stats: {
          totalGames,
          totalWins,
          advanced: numberOfAdvancedGames,
          classic: numberOfClassicGames
        }
      }
    })
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

//Controller method to handle match history export
export const exportMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Requests initiated via standard UI clicks will include the frontend domain in the 'Referer' header.
  const referer = req.headers.referer
  if (!referer || !referer.includes("http://localhost:3000")) {
    return res.status(403).json({
      success: false,
      message:
        "Direct download is not allowed. Please use the application interface."
    })
  }
  let idUser = req.user?.user_id
  try {
    let matchesFound = await MatchModel.find({ user: idUser })
    if (matchesFound.length === 0) {
      return res.redirect(
        "http://localhost:3000/history?error=no_matches"
      )
    }
    res.setHeader("Content-Type", "text/csv")
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="meciuri.csv"'
    )
    res.write(
      "ID Meci,Mod Joc,Mutare Jucator,Mutare Adversar,Rezultat,Data\n"
    )
    for (const match of matchesFound) {
      const matchDate = match.createdAt
        ? new Date(match.createdAt).toISOString().split("T")[0]
        : "N/A"
      const csvLine = `${match._id},${match.mode},${match.playerMove},${match.opponentMove},${match.result},${matchDate}\n`
      res.write(csvLine)
    }
    return res.status(200).end()
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}
