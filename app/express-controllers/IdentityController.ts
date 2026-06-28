import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import { UserModel } from "~/schemas/UserSchema"
import sendEmailNotification from "~/utils/backend-boilerplate/nodemailer-config"
import crypto from "crypto"
import { PasswordResetSchema } from "~/utils/zod-schemas/zod-validation"
import bcrypt from "bcrypt"

//Method that initiates the password reset process by generating a reset token, inserting it into the database, and sending an email.
export const requestPasswordReset = async (
  req: Request<{}, {}, { identity: string }>,
  res: Response,
  next: NextFunction
) => {
  let { identity } = req.body
  try {
    if (!identity) {
      return res.status(400).json({
        success: false,
        errors: {
          server:
            "Empty field! You must introduce either your email or your username!"
        }
      })
    }
    let userFound = null
    if (identity.includes("@")) {
      userFound = await UserModel.findOne({ email: identity })
    } else {
      userFound = await UserModel.findOne({ username: identity })
    }
    if (!userFound) {
      return res.status(404).json({
        success: false,
        errors: {
          server: "No account found with that email or username."
        }
      })
    }
    const passwordResetToken = crypto.randomBytes(32).toString("hex")
    userFound.passwordResetToken = passwordResetToken
    userFound.passwordResetTokenExpiresAt =
      Date.now() + 1 * 60 * 60 * 1000
    await userFound.save()
    const text = `Hello! Please click the link to reset your password: ${process.env.RESET_LINK}?token=${passwordResetToken}`
    await sendEmailNotification(
      userFound.email,
      "Password Reset Request",
      text
    )
    return res.status(200).json({
      success: true,
      message: "A reset link has been sent to your email address!"
    })
  } catch (err) {
    next(err)
  }
}

//Updates the user's password based on the unique token from the URL and the password introduced by the user in the new field
export const resetPassword = async (
  req: Request<
    {},
    {},
    { password: string; confirmPassword: string; token: string }
  >,
  res: Response,
  next: NextFunction
) => {
  let { password, confirmPassword, token } = req.body
  let passwordObject = { password, confirmPassword }
  const result = PasswordResetSchema.safeParse(passwordObject)
  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.format()
    })
  }
  try {
    if (!token) {
      return res.status(404).json({
        success: false,
        errors: "Token not found!"
      })
    }
    const userFound = await UserModel.findOne({
      passwordResetToken: token,
      passwordResetTokenExpiresAt: { $gt: Date.now() }
    })
    if (!userFound) {
      return res.status(400).json({
        message:
          "The verification link is invalid or has expired. Please request a new one.",
        success: false
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    userFound.password = hashedPassword
    userFound.passwordResetToken = undefined
    userFound.passwordResetTokenExpiresAt = undefined
    await userFound.save()
    return res.status(200).json({
      success: true,
      data: "Password updated successfully! You can now log in with your new credentials."
    })
  } catch (err) {
    next(err)
  }
}
