import mongoose, { Schema, model } from "mongoose"
// Define the User schema
const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true }
  },
  { timestamps: true }
)
export const UserModel = mongoose.model("User", userSchema)
