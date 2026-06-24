import { UserModel } from "~/schemas/UserSchema"
import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import crypto from "crypto"
import sendEmailNotification from "~/utils/backend-boilerplate/nodemailer-config"

//Verifies the user's email using the token provided in the query params
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.query.token as string
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token not available!"
      })
    }
    const userFound = await UserModel.findOne({
      verificationToken: token
    })
    if (!userFound) {
      return res.status(404).json({
        message: "User not found with that token or link expired",
        success: false
      })
    }
    if (
      userFound.verificationTokenExpiresAt &&
      Date.now() > userFound.verificationTokenExpiresAt.getTime()
    ) {
      return res.status(410).json({
        success: false,
        message:
          "The verification link has expired. Please request a new one."
      })
    }
    userFound.isVerified = true
    userFound.verificationToken = undefined
    userFound.verificationTokenExpiresAt = undefined
    const tokenInCookie = req.cookies?.token as string | undefined
    await userFound.save()
    return res.status(200).json({
      success: true,
      message: "Your account has been succesfully validated!",
      isLoggedIn: Boolean(tokenInCookie)
    })
  } catch (err) {
    next(err)
  }
}

//Generates a new verification token and resends the validation email for a logged-in user

export const resendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let idUser = req.user?.user_id
    const userFound = await UserModel.findById(idUser)
    if (!userFound) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" })
    }
    if (userFound.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified"
      })
    }
    userFound.verificationToken = crypto
      .randomBytes(32)
      .toString("hex")
    userFound.verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    )
    await userFound.save()
    let text = `Hello! Here is your new verification link: ${process.env.VALIDATION_LINK}?token=${userFound.verificationToken}`
    await sendEmailNotification(
      userFound.email,
      "New Email Validation Link",
      text
    )

    return res.status(200).json({
      success: true,
      message: "A new verification link has been sent to your email!"
    })
  } catch (err) {
    next(err)
  }
}
