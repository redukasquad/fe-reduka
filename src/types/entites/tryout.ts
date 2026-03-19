import type { TutorPermission } from "./tryout.permision"
import type { TryOutQuestion } from "./tryout.question"
import type { TryOutRegistration } from "./tryout.registration"
import type { User } from "./user"

export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export type PaymentStatus = 'pending' | 'approved' | 'rejected'

export interface TryOut {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null

  name: string
  description?: string
  imageUrl?: string
  driveLink?: string

  isFree: boolean
  price?: number
  qrisImageUrl?: string
  paymentLink?: string

  registrationStart: string
  registrationEnd: string

  isPublished: boolean
  createdByUserId: number

  creator?: User
  tutorPermissions?: TutorPermission[]
  questions?: TryOutQuestion[]
  registrations?: TryOutRegistration[]
}