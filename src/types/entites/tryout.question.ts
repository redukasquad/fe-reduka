import type { Subtest } from "./subtes"
import type { DifficultyLevel, TryOut } from "./tryout"
import type { User } from "./user"

export interface TryOutQuestion {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null

  tryOutPackageId: number
  subtestId: number

  questionText: string
  imageUrl?: string
  explanation?: string

  difficultyLevel: DifficultyLevel
  orderNumber: number

  optionA: string
  optionB: string
  optionC: string
  optionD: string
  optionE: string

  correctOption: 'A' | 'B' | 'C' | 'D' | 'E'
  createdByUserId: number

  tryOutPackage?: TryOut
  subtest?: Subtest
  creator?: User
}