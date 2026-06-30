import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"

import multer from "multer"
import {
  exportMatches,
  getUserStats,
  importMatches
} from "~/express-controllers/MatchController"
import { authentificationMiddleware } from "~/middlewares/authMiddleware"
import { MatchModel } from "~/schemas/MatchSchema"
const upload = multer({
  dest: "/app/csv-files",
  limits: {
    fileSize: 10 * 1024 * 1024
  }
})
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
matchRouter.get("/stats", authentificationMiddleware, getUserStats)

//Route that exports user match history to a CSV file and requires authentication cookie
matchRouter.get("/export", authentificationMiddleware, exportMatches)

//Route that bulk imports matches from a user-uploaded CSV file and requires authentication cookie
matchRouter.post(
  "/import",
  authentificationMiddleware,
  upload.single("csvFile"),
  importMatches
)
