import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import "dotenv/config" // Load environment variables from .env file
const app = express()
const port = process.env.PORT || 5000
import { router } from "../express-router/router"
import cors from "cors"
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/api", router)
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
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
