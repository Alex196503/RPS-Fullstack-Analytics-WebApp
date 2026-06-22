import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import { authentificationMiddleware } from "~/middlewares/authMiddleware"
import { MatchModel } from "~/schemas/MatchSchema"
import { UserModel } from "~/schemas/UserSchema"
import type { ScoreReqBody } from "~/types/types"
import { updateModeScore } from "~/utils/backend-boilerplate/backend-functions"
export const scoreRouter = express.Router()

//Route that queries the mongoDB database to select current user score
scoreRouter.get(
  "/",
  authentificationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let id = req.user?.user_id
      let userScore = await UserModel.findById(id).select(
        "classicScore advancedScore"
      )
      if (!userScore) {
        return res.status(401).json({
          success: false,
          message: "Score not found"
        })
      }
      return res.status(200).json({
        message: "Request succedeed!",
        scores: {
          classic: userScore.classicScore,
          advanced: userScore.advancedScore
        },
        success: true
      })
    } catch (err) {
      next(err)
    }
  }
)

//Route that handles the game outcome submission from the frontend fetcher.
scoreRouter.post(
  "/update",
  authentificationMiddleware,
  async (
    req: Request<{}, {}, ScoreReqBody>,
    res: Response,
    next: NextFunction
  ) => {
    let id = req.user?.user_id
    try {
      let userFound = await UserModel.findById(id).select(
        "classicScore advancedScore"
      )
      if (!userFound) {
        return res.status(401).json({
          success: false,
          message: "Score not found"
        })
      }
      let { outcome, gamemode, playerMove, opponentMove, result } =
        req.body
      if (
        !outcome ||
        !gamemode ||
        !playerMove ||
        !opponentMove ||
        !result
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields in request body"
        })
      }
      updateModeScore(userFound, gamemode, outcome)

      //This method commits the in-memory changes to MongoDB and sends all updated values to the DB in a single network request
      await userFound.save()

      const match = new MatchModel({
        user: id,
        playerMove,
        opponentMove,
        result,
        mode: gamemode
      })
      await match.save()
      return res.status(200).json({
        success: true,
        message: {
          scoreInfo: `Score updated successfully for ${gamemode}`,
          matchInfo: `Match created at ${match.createdAt}`
        },
        scores: {
          classic: userFound.classicScore,
          advanced: userFound.advancedScore
        }
      })
    } catch (err) {
      next(err)
    }
  }
)
