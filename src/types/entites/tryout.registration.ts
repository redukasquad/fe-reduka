import type { PaymentStatus, TryOut } from "./tryout"
import type { TryOutAttempt } from "./tryout.attempt"
import type { User } from "./user"

export interface TryOutRegistration {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null

  userId: number
  tryOutPackageId: number

  paymentProofUrl?: string
  paymentStatus: PaymentStatus
  rejectionReason?: string

  approvedByUserId?: number
  approvedAt?: string
  registeredAt: string

  user?: User
  tryOutPackage?: TryOut
  approvedBy?: User
  attempt?: TryOutAttempt
}