import type { Subtest } from "./subtes"
import type { TryOutAttempt } from "./tryout.attempt"

export interface SubtestResult {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null

  attemptId: number
  subtestId: number

  startedAt?: string
  finishedAt?: string

  correctCount: number
  wrongCount: number
  unansweredCount: number

  rawScore?: number
  finalScore?: number

  attempt?: TryOutAttempt
  subtest?: Subtest
}