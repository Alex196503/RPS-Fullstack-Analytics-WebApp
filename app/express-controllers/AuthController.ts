import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import { UserModel } from "~/schemas/UserSchema"
import { LoginSchema } from "~/utils/zod-schemas/zod-validation"
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"
import type z from "zod"

//Validates user credentials, signs a JWT token, and sets the authentication cookie
type LoginInput = z.infer<typeof LoginSchema>
export const authenticate = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) => {
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

    res.cookie("token", jwt_data, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "none" : "lax",
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
