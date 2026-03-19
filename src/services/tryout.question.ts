import type { CreateTryoutQuestionInput, UpdateTryoutQuestionInput } from "../schemas/tryout.question"
import type { ApiResponse } from "../types/api"
import type { Subtest } from "../types/entites/subtes"
import type { TryOutQuestion } from "../types/entites/tryout.question"
import api from "./api"

export class TryOutQuestionService {
  static async getSubtestQuestionCount(
    tryoutId: number
  ): Promise<ApiResponse<Subtest[]>> {
    const res = await api.get(`/tryouts/${tryoutId}/subtests`)
    return res.data
  }

  static async getQuestions(
    tryoutId: number,
    subtestId?: number,
    q?: string,
    difficulty?: string
  ): Promise<ApiResponse<TryOutQuestion[]>> {
    const params = new URLSearchParams()
    if (q) params.append('q', q)
    if (difficulty) params.append('difficulty', difficulty)
    
    const url = subtestId && subtestId !== 0
      ? `/tryouts/${tryoutId}/subtests/${subtestId}/questions`
      : `/tryouts/${tryoutId}/questions`
      
    const res = await api.get(`${url}?${params.toString()}`)
    return res.data
  }

  static async createQuestion(
    tryoudId: number,
    subtestId: number,
    value: CreateTryoutQuestionInput
  ): Promise<ApiResponse<any>> {
    const res = await api.post(`/tryouts/${tryoudId}/subtests/${subtestId}/questions`, value)
    return res.data
  }

  static async updateQuestion(
    questionId: number,
    value: UpdateTryoutQuestionInput
  ): Promise<ApiResponse<any>> {
    const res = await api.put(`/tryouts/questions/${questionId}`, value)
    return res.data
  }

  static async deleteQuestion(
    questionId: number
  ): Promise<ApiResponse<any>> {
    const res = await api.delete(`/tryouts/questions/${questionId}`)
    return res.data
  }
}