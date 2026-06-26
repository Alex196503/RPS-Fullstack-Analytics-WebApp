//nf
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

//nf
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
