import type { Types } from "mongoose"
import type { Express as ExpressRequest } from "express"
export type FormData = {
  username: string | null
  email: string | null
  password: string | null
  confirmPassword?: string | null
  avatar: string
}

export type UserProps = {
  username: string
  email: string
  avatar: string
  createdAt?: string
  isVerified?: boolean
}

export type User = Pick<
  FormData,
  "email" | "password" | "avatar" | "username"
> & { id: string }

export interface InitialData {
  username: string
  email: string
  avatar?: string
}

export interface EditProfileResponse {
  message: string
  success: boolean
  data?: {
    username: string
    email: string
    avatar: string
  }
  errors?: {
    [key: string]: string[]
  }
}

export interface VerifyQuery {
  token?: string
}

interface VerifyErrorResponse {
  success: false
  message: string
}

interface VerifySuccessResponse {
  success: true
  message: string
  isLoggedIn: boolean
}

export type VerifyResponse =
  VerifyErrorResponse | VerifySuccessResponse

export interface UserLoaderSuccess {
  user?: {
    _id: string
    username: string
    avatar: string
    email?: string
    isVerified?: boolean
  }
}

export type RowData = {
  mode: "classic" | "advanced"
  result: "win" | "loss" | "draw"
  playerMove: "rock" | "paper" | "scissors"
  opponentMove: "rock" | "paper" | "scissors"
}

export interface UpdateProfileOptions {
  username?: string
  email?: string
  password?: string
  avatarPath?: string
}
