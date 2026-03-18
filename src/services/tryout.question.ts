import type { CreateTryoutQuestionInput } from "../schemas/tryout.question"
import type { ApiResponse } from "../types/api"
import type { Subtest } from "../types/entites/subtes"
import api from "./api"

export class TryOutQuestionService {
  static async getSubtestQuestionCount(
    tryoutId: number
  ): Promise<ApiResponse<Subtest[]>> {
    const res = await api.get(`/tryouts/${tryoutId}/subtests`)
    return res.data
  }
  static async createQuestion(
    tryoudId:number,
    subtestId:number,
    value:CreateTryoutQuestionInput
  ): Promise<ApiResponse<any>> {
    const res = await api.post(`/tryouts/${tryoudId}/subtests/${subtestId}/questions`,value)
    return res.data
  }
}