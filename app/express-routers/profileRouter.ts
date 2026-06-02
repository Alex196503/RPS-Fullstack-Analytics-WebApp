import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import { UserModel } from "../schemas/UserSchema"
import { authentificationMiddleware } from "~/middlewares/authMiddleware"
import multer from "multer"
import bcrypt from "bcrypt"
import { EditProfileSchema } from "~/utils/zod-validation"
const upload = multer({ dest: "app/uploads/" })
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

//Route to edit the user profile, that checks if the user is authenticated with the authentificationMiddleware
profileRouter.put(
  "/edit",
  authentificationMiddleware,
  upload.single("avatar"),
  async (req: Request, res: Response, next: NextFunction) => {
    let id = req.user?.user_id
    const { username, email, password } = req.body as {
      username: string
      email: string
      password?: string
    }
    const resultEditProfile = EditProfileSchema.safeParse({
      username,
      email,
      password
    })
    if (!resultEditProfile.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: resultEditProfile.error.flatten().fieldErrors
      })
    }
    try {
      let userFound = await UserModel.findById({ _id: id })
      if (!userFound) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        })
      }
      let updateData = { username, email } as {
        username: string
        email: string
        avatar?: string
        password?: string
      }
      if (password && password.trim().length > 0) {
        const salt = await bcrypt.genSalt(10)
        const cryptedPass = await bcrypt.hash(password, salt)
        updateData.password = cryptedPass
      }
      if (req.file) {
        updateData = { ...updateData, avatar: req.file.filename }
      }
      await UserModel.findByIdAndUpdate(id, { $set: updateData })
      return res.status(200).json({
        message: "Profile updated successfully!",
        success: true
      })
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
