import type { Subtest } from "./subtes"
import type { SubtestResult } from "./subtest.result"
import type { TryOutRegistration } from "./tryout.registration"
import type { UserTryOutAnswer } from "./user.tryout.answer"

export interface TryOutAttempt {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null

  registrationId: number

  startedAt?: string
  finishedAt?: string

  currentSubtestId?: number
  status: AttemptStatus
  totalScore?: number

  registration?: TryOutRegistration
  currentSubtest?: Subtest
  subtestResults?: SubtestResult[]
  answers?: UserTryOutAnswer[]
}
export type AttemptStatus = 'not_started' | 'in_progress' | 'completed'