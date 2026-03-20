import type { PaymentStatus, TryOut } from "./tryout"
import type { User } from "./user"

export interface TryOutRegistration {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null

  userId: number
  tryOutId: number

  paymentProofUrl?: string
  paymentStatus: PaymentStatus
  rejectionReason?: string

  approvedByUserId?: number
  approvedAt?: string
  registeredAt: string

  user?: User
  tryOut?: TryOut
  approvedBy?: User
  hasAttempt?: boolean
  attempt?: {
    id: number
    status: 'not_started' | 'in_progress' | 'completed'
    totalScore?: number
  }
}