import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import { authentificationMiddleware } from "~/middlewares/authMiddleware"
import { MatchModel } from "~/schemas/MatchSchema"
import type { StatsResponse } from "~/types/types"
export const matchRouter = express.Router()

//Route that queries the database to select the existing matches of the current user that is logged in
matchRouter.get(
  "/",
  authentificationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    let idUser = req.user?.user_id
    try {
      let matchesFound = await MatchModel.find({
        user: idUser
      }).sort({ createdAt: -1 })
      if (matchesFound.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No matches found",
          data: []
        })
      }
      return res.status(200).json({
        message: "Matches found",
        data: matchesFound,
        success: true
      })
    } catch (e) {
      next(e)
    }
  }
)

//Route that makes fast queries to find some informations about user stats
matchRouter.get(
  "/stats",
  authentificationMiddleware,
  async (
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
)
