import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import "dotenv/config" // Load environment variables from .env file
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import path from "path"
export const app = express()
const port = process.env.PORT || 5000
import { authRouter } from "../express-routers/authRouter"
import { profileRouter } from "~/express-routers/profileRouter"
await mongoose
  .connect(process.env.MONGODB_URI || "")
  .catch((err) => console.log("Failed to connect to MongoDB:", err))
import cors from "cors"
import { scoreRouter } from "~/express-routers/scoreRouter"
import { matchRouter } from "~/express-routers/matchRouter"

// Allowed origins for CORS, permitting local development environments
// and the live production frontend hosted on Render to securely
// exchange credentials and API requests with the backend.
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://rps-frontend-n357.onrender.com"
]
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error("Blocked by CORS policy"))
      }
    },
    credentials: true
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
//Adding a new cookie parser middleware
app.use(cookieParser())

// Registering default routers to map domain-specific endpoints to their respective routers
app.use("/profile", profileRouter)
app.use("/api", authRouter)
app.use("/score", scoreRouter)
app.use("/match", matchRouter)
//Global middleware error
app.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
    res.status(500).json({
      success: false,
      message: "Something bad happened with the server!",
      error: err.message || "Internal Server Error"
    })
  }
)

// Handle 404 errors for undefined routes
app.use((req: Request, res: Response) => {
  return res
    .status(404)
    .json({ success: false, message: "Route not found!" })
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// Extend the Express Request interface globally to include the custom 'user' property.
declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string
      }
    }
  }
}
