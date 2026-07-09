//Contains global mocked data and Mongoose model spies used across integration tests.
import { vi, vitest } from "vitest"

// A standard mocked user document mirroring the Mongoose database schema.
export const mocked_user = {
  _id: "mocked_user_id_123",
  email: process.env.GMAIL_USER || "alexmoldovan2009@gmail.com",
  username: process.env.TEST_USERNAME || "darkista",
  password: process.env.TEST_PASSWORD || "TestPassword1"
}

// Reusable mock functions (spies) for the UserModel methods. By default, they resolve successfully with the default MOCKED_USER data.
export const mocked_user_model = {
  findOne: vi.fn().mockResolvedValue(mocked_user),
  findById: vi.fn().mockResolvedValue(mocked_user),
  findByIdAndUpdate: vi.fn().mockResolvedValue(mocked_user)
}

//A standard mocked object to simulate the bcrypt function
export const bcrypt_mocked = {
  genSalt: vi.fn().mockResolvedValue("mocked_salt"),
  hash: vi.fn().mockResolvedValue("mocked_hashed_password"),
  compare: vi.fn().mockResolvedValue(true)
}
