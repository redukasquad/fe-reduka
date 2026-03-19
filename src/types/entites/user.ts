export type UserRole = "ADMIN" | "TUTOR" | "STUDENT"

// GET /users returns []entities.User (gorm.Model → ID uppercase)
export interface User {
  ID: number
  username: string
  email: string
  noTelp?: string
  jenisKelamin?: boolean
  kelas?: "Kelas 10" | "Kelas 11" | "Kelas 12" | "Gapyer (Alumni)"
  role?: UserRole
  authProvider?: string
  profileImage?: string
  isVerified?: boolean
}
