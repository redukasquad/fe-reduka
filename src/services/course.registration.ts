import type { ApiResponse } from "../types/api"
import type { CourseRegistration } from "../types/entites/courseRegistration"
import api from "./api"

export class CourseRegistrationService{
   static async getRegistration(
    tryoutId: number
  ): Promise<ApiResponse<CourseRegistration[]>> {
    const res = await api.get(`/courses/${tryoutId}/registrations`)
    return res.data
  }
}