import {
  type NextFunction,
  type Request,
  type Response
} from "express"
import "dotenv/config"
import jwt, { type JwtPayload } from "jsonwebtoken"

// Middleware to protect private routes. It extracts the JWT from the secure cookie, verifies it, and attaches the payload to req.user before moving to the next handler.
export const authentificationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token as string | undefined
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token not provided!" })
  }
  const secretKey = process.env.JWT_SECRET
  if (!secretKey) {
    return next(
      new Error(
        "JWT secret key is not defined in environment variables"
      )
    )
  }
  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload
    ;(req as any).user = { user_id: decoded.user_id }
    next()
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", success: false })
  }
}
