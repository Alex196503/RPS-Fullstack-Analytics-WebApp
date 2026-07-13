import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import { UserModel } from "../schemas/UserSchema"
import crypto from "crypto"
import {
  FileValidationSchema,
  PasswordResetSchema,
  RegisterSchema
} from "../utils/zod-schemas/zod-validation"
import multer from "multer"
import bcrypt from "bcrypt"
import sendEmailNotification from "~/utils/backend-boilerplate/nodemailer-config"
import { authentificationMiddleware } from "~/middlewares/authMiddleware"
import {
  resendVerificationEmail,
  verifyEmail
} from "~/express-controllers/EmailVerificationController"
import { authenticate } from "~/express-controllers/AuthController"
import {
  requestPasswordReset,
  resetPassword
} from "~/express-controllers/IdentityController"
import type z from "zod"
import { uploadMiddleware } from "~/utils/backend-boilerplate/cloudinary-upload-middleware"
export const authRouter = express.Router()

type RegisterInput = z.infer<typeof RegisterSchema>
//The register route that performs and validates our register based on our zod validation schema
authRouter.post(
  "/register",
  uploadMiddleware("avatars").single("avatar"),
  async (
    req: Request<{}, {}, RegisterInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Profile picture is required" })
      }
      const result = RegisterSchema.safeParse(req.body)
      const fileResult = FileValidationSchema.safeParse(req.file)
      const verificationToken = crypto.randomBytes(32).toString("hex")
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
      const avatar = req.file ? req.file.path : undefined
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
        avatar,
        username,
        verificationToken,
        verificationTokenExpiresAt: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        )
      })
      await user.save()
      let text = `Hello! Please click the link to validate your email: ${process.env.VALIDATION_LINK}?token=${verificationToken}`
      await sendEmailNotification(email, "Email validation", text)
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

// Route to authenticate the user and establish a session cookie
authRouter.post("/login", authenticate)

// Route to handle email verification via token sent from the loader
authRouter.post("/verify-email", verifyEmail)

// Route for authenticated users to request a new email verification token
authRouter.post(
  "/resend-verification",
  authentificationMiddleware,
  resendVerificationEmail
)

// Route that handles password reset requests by invoking the requestPasswordReset controller method
authRouter.post("/forgot-password", requestPasswordReset)

// Route that handles the password reset form submission and forwards the payload to the controller for secure validation
authRouter.post("/reset-password", resetPassword)
