import * as z from "zod"
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
]

//Custom Zod schema for the input file
export const FileValidationSchema = z.object({
  originalname: z.string(),
  filename: z.string(),
  mimetype: z
    .string()
    .refine(
      (type) => ACCEPTED_IMAGE_TYPES.includes(type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  size: z.number().max(MAX_FILE_SIZE, "Max file size is 5MB.")
})

// Defined  Zod schema for registration form validation
export const RegisterSchema = z
  .object({
    username: z
      .string("The username is required")
      .min(3, "The username must be at least 3 characters long")
      .max(15, "The username cannot exceed 15 characters"),
    email: z
      .string("The email is required")
      .email("Invalid email address")
      .min(10, "Email must be at least 10 characters long"),
    password: z
      .string("The password is required")
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
        "Password must contain at least one letter and one number"
      ),
    confirmPassword: z.string("Confirm password is required")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })

//Defined Zod Schema for login form validation
export const LoginSchema = z.object({
  email: z
    .string("The email is required")
    .email("Invalid email address")
    .min(10, "Email must be at least 10 characters long"),
  password: z
    .string("The password is required")
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
      "Password must contain at least one letter and one number"
    )
})

export type RegisterInput = z.infer<typeof RegisterSchema>

//Edit profile schema that validates the username, email and password fields
export const EditProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
      "Password must contain at least one letter and one number"
    )
    .optional()
    .or(z.literal(""))
})

//Password Reset schema that ensures both fields(password and confirm password) respect our validation schema
export const PasswordResetSchema = z
  .object({
    password: z
      .string("The password is required")
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
        "Password must contain at least one letter and one number"
      ),
    confirmPassword: z.string("Confirm password is required")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })

export type EditProfileInput = z.infer<typeof EditProfileSchema>
export type PasswordResetInput = z.infer<typeof PasswordResetSchema>
