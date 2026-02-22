import type { TryOutAttempt } from "./tryout.attempt"
import type { TryOutQuestion } from "./tryout.question"

export interface UserTryOutAnswer {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null

  attemptId: number
  questionId: number

  selectedOption?: 'A' | 'B' | 'C' | 'D' | 'E'
  isCorrect?: boolean
  answeredAt?: string

  attempt?: TryOutAttempt
  question?: TryOutQuestion
}