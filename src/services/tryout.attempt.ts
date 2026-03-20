import type { ApiResponse } from '../types/api'
import api from './api'

export interface AttemptResponse {
  id: number
  registrationId: number
  tryOut?: { id: number; name: string }
  startedAt?: string
  finishedAt?: string
  status: 'not_started' | 'in_progress' | 'completed'
  currentSubtestId?: number
  totalScore?: number
  subtestResults?: SubtestResultResponse[]
}

export interface SubtestBrief {
  id: number
  code: string
  name: string
  questionCount: number
  timeLimitSeconds: number
  maxScore: number
}

export interface SubtestProgress {
  subtestId: number
  subtestCode: string
  subtestName: string
  status: 'not_started' | 'in_progress' | 'completed'
  answeredCount: number
  totalCount: number
}

export interface AttemptCurrentState {
  id: number
  status: string
  currentSubtest?: SubtestBrief
  timeRemaining?: number
  subtestProgress: SubtestProgress[]
}

export interface QuestionForExam {
  id: number
  orderNumber: number
  questionText: string
  imageUrl?: string
  difficultyLevel: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  optionE: string
  selectedOption?: string | null
}

export interface SubtestResultResponse {
  id: number
  subtestId: number
  subtest?: SubtestBrief
  startedAt?: string
  finishedAt?: string
  correctCount: number
  wrongCount: number
  unansweredCount: number
  rawScore?: number
  finalScore?: number
}

export interface QuestionReview {
  id: number
  orderNumber: number
  questionText: string
  imageUrl?: string
  difficultyLevel: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  optionE: string
  correctOption: string
  selectedOption: string | null
  isCorrect: boolean | null
  explanation?: string
}

export interface SubtestReview {
  subtestId: number
  subtestCode: string
  subtestName: string
  questions: QuestionReview[]
}

export interface SubmitAnswer {
  questionId: number
  selectedOption: string
}

export class TryoutAttemptService {
  static async startAttempt(registrationId: number): Promise<ApiResponse<AttemptResponse>> {
    const res = await api.post(`/tryouts/registrations/${registrationId}/start`)
    return res.data
  }

  static async getCurrentState(attemptId: number): Promise<ApiResponse<AttemptCurrentState>> {
    const res = await api.get(`/tryouts/attempts/${attemptId}/current`)
    return res.data
  }

  static async startSubtest(attemptId: number, subtestId: number): Promise<ApiResponse<QuestionForExam[]>> {
    const res = await api.get(`/tryouts/attempts/${attemptId}/subtests/${subtestId}/start`)
    return res.data
  }

  static async submitSubtest(attemptId: number, subtestId: number, answers: SubmitAnswer[]): Promise<ApiResponse<SubtestResultResponse>> {
    const res = await api.post(`/tryouts/attempts/${attemptId}/subtests/${subtestId}/submit`, { answers })
    return res.data
  }

  static async finishAttempt(attemptId: number): Promise<ApiResponse<AttemptResponse>> {
    const res = await api.post(`/tryouts/attempts/${attemptId}/finish`)
    return res.data
  }

  static async getResults(attemptId: number): Promise<ApiResponse<AttemptResponse>> {
    const res = await api.get(`/tryouts/attempts/${attemptId}/results`)
    return res.data
  }

  static async getSubtestReview(attemptId: number, subtestId: number): Promise<ApiResponse<SubtestReview>> {
    const res = await api.get(`/tryouts/attempts/${attemptId}/subtests/${subtestId}/review`)
    return res.data
  }
}
