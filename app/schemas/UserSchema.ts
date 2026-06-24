import mongoose, { Schema } from "mongoose"
// Defining the User schema
const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date },
    classicScore: {
      wins: { type: Number, default: 0, min: 0 },
      losses: { type: Number, default: 0, min: 0 },
      draws: { type: Number, default: 0, min: 0 },
      totalScore: { type: Number, default: 0, min: 0 }
    },
    advancedScore: {
      wins: { type: Number, default: 0, min: 0 },
      losses: { type: Number, default: 0, min: 0 },
      draws: { type: Number, default: 0, min: 0 },
      totalScore: { type: Number, default: 0, min: 0 }
    }
  },
  { timestamps: true }
)

//Mongoose middleware to calculate the total score every time user data is saved into database
userSchema.pre("save", function () {
  if (this.classicScore) {
    const classicWins = this.classicScore?.wins || 0
    const classicDraws = this.classicScore?.draws || 0
    this.classicScore.totalScore = classicWins * 3 + classicDraws
  }
  if (this.advancedScore) {
    const advancedWins = this.advancedScore.wins || 0
    const advancedDraws = this.advancedScore.draws || 0
    this.advancedScore.totalScore = advancedWins * 3 + advancedDraws
  }
})
export const UserModel = mongoose.model("User", userSchema)
