import express, {
  type NextFunction,
  type Request,
  type Response
} from "express"
import { MatchModel } from "~/schemas/MatchSchema"
import { type StatsResponse } from "~/types/game-types"
import fs from "fs"
import csv from "csv-parser"
import { CSVInputSchema } from "~/utils/zod-schemas/zod-validation"
import type { RowData } from "~/types/auth-user-types"

//Controller method to compute and return user gameplay statistics.
export const getUserStats = async (
  req: Request,
  res: Response<StatsResponse>,
  next: NextFunction
) => {
  let idUser = req.user?.user_id
  try {
    let rank = "Rookie Gladiator"
    let emoji = "🥉"
    let badges: string[] = []
    let [numberOfAdvancedGames, numberOfClassicGames, totalWins] =
      await Promise.all([
        MatchModel.countDocuments({
          user: idUser,
          mode: "advanced"
        }),
        MatchModel.countDocuments({
          user: idUser,
          mode: "classic"
        }),
        MatchModel.countDocuments({ user: idUser, result: "win" })
      ])
    let totalGames = numberOfAdvancedGames + numberOfClassicGames
    if (totalWins >= 50) {
      rank = "Diamond Legend"
      emoji = "💎"
    } else if (totalWins >= 11) {
      rank = "Gold Master"
      emoji = "🥇"
    } else if (numberOfAdvancedGames > 10) {
      rank = "Advanced Strategist"
      emoji = "⚡"
    } else if (
      totalGames > 20 &&
      numberOfClassicGames / totalGames > 0.9
    ) {
      rank = "Classic Purist"
      emoji = "🪵"
    }
    res.status(200).json({
      success: true,
      data: {
        rank,
        emoji,
        badges,
        stats: {
          totalGames,
          totalWins,
          advanced: numberOfAdvancedGames,
          classic: numberOfClassicGames
        }
      }
    })
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

//Controller method to handle match history export
export const exportMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Requests initiated via standard UI clicks will include the frontend domain in the 'Referer' header.
  const referer = req.headers.referer
  const frontEndUrl =
    process.env.FRONTEND_URL || "http://localhost:3000"
  if (!referer || !referer.includes(frontEndUrl)) {
    return res.status(403).json({
      success: false,
      message:
        "Direct download is not allowed. Please use the application interface."
    })
  }
  let idUser = req.user?.user_id
  try {
    let matchesFound = await MatchModel.find({ user: idUser })
    if (matchesFound.length === 0) {
      return res.redirect(`${frontEndUrl}/history?error=no_matches`)
    }
    res.setHeader("Content-Type", "text/csv")
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="meciuri.csv"'
    )
    res.write(
      "ID Meci,Mod Joc,Mutare Jucator,Mutare Adversar,Rezultat,Data\n"
    )
    for (const match of matchesFound) {
      const matchDate = match.createdAt
        ? new Date(match.createdAt).toISOString().split("T")[0]
        : "N/A"
      const csvLine = `${match._id},${match.mode},${match.playerMove},${match.opponentMove},${match.result},${matchDate}\n`
      res.write(csvLine)
    }
    return res.status(200).end()
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

//Handles file metadata validation, CSV stream parsing, and bulk insertion into MongoDB
export const importMatches = async (
  req: Request,
  res: Response<{ success: boolean; message: string }>,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "CSV file is required", success: false })
    }
    const fileValidationSchema = CSVInputSchema.safeParse(req.file)
    const filePath = req.file.path
    if (!fileValidationSchema.success) {
      if (req.file.path) fs.unlink(filePath, () => {})
      return res.status(400).json({
        success: false,
        message: fileValidationSchema.error.issues[0].message
      })
    }
    let results: (RowData & { user: string | undefined })[] = []
    const idUser = req.user?.user_id
    const fileStream = fs.createReadStream(filePath)
    fileStream
      .pipe(
        csv({
          separator: ",",
          //Cleaning the invisible characters from the header table
          mapHeaders: ({ header }) =>
            header.trim().replace(/^\uFEFF/, "")
        })
      )
      .on("data", (chunk: RowData) =>
        results.push({ user: idUser, ...chunk })
      )
      .on("error", (streamErr) => {
        fileStream.destroy()
        if (req.file) {
          fs.unlink(filePath, () => {})
        }
        return next(streamErr)
      })
      .on("end", async () => {
        try {
          await MatchModel.insertMany(results)
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Could not delete temporary file:", err)
            }
          })
          return res.status(200).json({
            message: "File imported and data saved",
            success: true
          })
        } catch (err) {
          fs.unlink(filePath, () => {})
          if (err instanceof Error) {
            return res.status(400).json({
              success: false,
              message: err.message
            })
          }
          return next(err)
        }
      })
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}
