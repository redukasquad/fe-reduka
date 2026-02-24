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
}