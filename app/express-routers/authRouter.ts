import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import jsonwebtoken from "jsonwebtoken"
import { UserModel } from "../schemas/UserSchema"
import {
  FileValidationSchema,
  LoginSchema,
  RegisterSchema
} from "../utils/zod-validation"
import multer from "multer"
import bcrypt from "bcrypt"
const upload = multer({ dest: "app/uploads/" })
export const authRouter = express.Router()

//The register route that performs and validates our register based on our zod validation schema
authRouter.post(
  "/register",
  upload.single("avatar"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Profile picture is required" })
      }
      const result = RegisterSchema.safeParse(req.body)
      const fileResult = FileValidationSchema.safeParse(req.file)

      if (!result.success) {
        return res.status(400).json({
          success: false,
          errors: result.error.format()
        })
      }

      if (!fileResult.success) {
        return res.status(400).json({
          success: false,
          errors: fileResult.error.format()
        })
      }
      const userData = result.data
      const fileData = fileResult.data
      let { email, password, username } = userData
      let userAlreadyExists = await UserModel.findOne({
        email: email
      })
      if (userAlreadyExists) {
        return res.status(400).json({
          success: false,
          errors: {
            server:
              "An account with this email address already exists."
          }
        })
      }
      let salt = await bcrypt.genSalt(10)
      let bcryptedPassword = await bcrypt.hash(password, salt)
      const user = new UserModel({
        email,
        password: bcryptedPassword,
        avatar: fileData.filename,
        username
      })
      await user.save()
      return res.status(201).json({
        message: "User registered successfully!",
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      })
    } catch (err) {
      next(err)
    }
  }
)

authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resultLogin = LoginSchema.safeParse(req.body)
      if (!resultLogin.success) {
        return res.status(400).json({
          success: false,
          errors: resultLogin.error.format()
        })
      }
      const userLoginData = resultLogin.data
      const { email, password } = userLoginData
      let foundUser = await UserModel.findOne({ email: email })
      if (!foundUser) {
        return res
          .status(404)
          .json({ message: "User not found!", success: false })
      }
      let result = await bcrypt.compare(password, foundUser.password)
      if (!result) {
        return res.status(401).json({
          message: "Invalid email or password!",
          success: false
        })
      }
      let secret_key = process.env.JWT_SECRET
      if (!secret_key) {
        return next(
          new Error(
            "JWT secret key is not defined in environment variables"
          )
        )
      }
      const jwt_data = jsonwebtoken.sign(
        { user_id: foundUser._id },
        secret_key,
        { expiresIn: "1h" }
      )
      // Set the JWT token in an HTTP-only cookie
      res.cookie("token", jwt_data, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600000
      })
      return res.status(200).json({
        message: "Login succesful",
        success: true,
        token: jwt_data,
        user: {
          id: foundUser._id,
          username: foundUser.username,
          email: foundUser.email,
          avatar: foundUser.avatar
        }
      })
    } catch (err) {
      next(err)
    }
  }
)
