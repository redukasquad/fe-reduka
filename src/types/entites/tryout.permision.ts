import type { TryOut } from "./tryout"
import type { User } from "./user"

export interface TutorPermission {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null

  tryOutPackageId: number
  userId: number
  grantedByUserId: number
  grantedAt: string

  tryOutPackage?: TryOut
  user?: User
  grantedBy?: User
}