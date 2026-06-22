import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import { authentificationMiddleware } from "~/middlewares/authMiddleware"
import { MatchModel } from "~/schemas/MatchSchema"
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
