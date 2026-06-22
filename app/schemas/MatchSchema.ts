import mongoose, { Schema } from "mongoose"
//Defining the matchSchema
const matchSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    playerMove: { type: String, required: true },
    opponentMove: { type: String, required: true },
    result: { type: String, required: true },
    mode: { type: String, required: true }
  },
  { timestamps: true }
)
export const MatchModel = mongoose.model("Match", matchSchema)
