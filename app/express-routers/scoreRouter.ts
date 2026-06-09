import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import { authentificationMiddleware } from "~/middlewares/authMiddleware"
import { UserModel } from "~/schemas/UserSchema"
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
  async (req: Request, res: Response, next: NextFunction) => {
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
      let { outcome, gamemode } = req.body as {
        outcome: string
        gamemode: string
      }
      if (!outcome || !gamemode) {
        return res.status(400).json({
          success: false,
          message: "Missing game outcome or game mode in request body"
        })
      }
      updateModeScore(userFound, gamemode, outcome)

      //This method commits the in-memory changes to MongoDB and sends all updated values to the DB in a single network request
      await userFound.save()
      return res.status(200).json({
        success: true,
        message: `Score updated successfully for ${gamemode}`,
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
