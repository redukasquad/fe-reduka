export interface Subtest {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null

  code: string
  name: string
  questionCount: number
  timeLimitSeconds: number
  maxScore: number
}