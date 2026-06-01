import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import { UserModel } from "../schemas/UserSchema"
import { authentificationMiddleware } from "~/middlewares/authMiddleware"
export const profileRouter = express.Router()

//Route to get the user profile data, that checks if the user is authenticated with the authentificationMiddleware
profileRouter.get(
  "/",
  authentificationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let id = req.user?.user_id
      let userFound = await UserModel.findOne({ _id: id })
      if (!userFound) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        })
      }
      let data = {
        username: userFound.username,
        email: userFound.email,
        avatar: userFound.avatar,
        createdAt: userFound.createdAt || Date.now()
      }
      return res
        .status(200)
        .json({ data: data, message: "User found!", success: true })
    } catch (err) {
      next(err)
    }
  }
)

//Route to delete the user profile, that checks if the user is authenticated with the authentificationMiddleware
profileRouter.post(
  "/delete",
  authentificationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let id = req.user?.user_id
      let userFound = await UserModel.findOne({ _id: id })
      if (!userFound) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        })
      }
      res.clearCookie("token")
      await UserModel.deleteOne({ _id: id })
      return res
        .status(200)
        .json({ message: "User deleted!", success: true })
    } catch (err) {
      next(err)
    }
  }
)
