import type { ApiResponse } from "../types/api"
import type { CourseRegistration } from "../types/entites/courseRegistration"
import api from "./api"

export class CourseRegistrationService {
  static async register(courseId: number, answers: { questionId: number; answerText: string }[] = []): Promise<ApiResponse<CourseRegistration>> {
    const res = await api.post(`/courses/${courseId}/register`, { answers })
    return res.data
  }

  static async getMyRegistrations(): Promise<ApiResponse<CourseRegistration[]>> {
    const res = await api.get(`/registrations/me`)
    return res.data
  }

  static async getRegistration(courseId: number): Promise<ApiResponse<CourseRegistration[]>> {
    const res = await api.get(`/courses/${courseId}/registrations`)
    return res.data
  }

  static async approve(idRegistration: number): Promise<ApiResponse<CourseRegistration>> {
    const res = await api.put(`/registrations/${idRegistration}/approve`)
    return res.data
  }

  static async reject(idRegistration: number): Promise<ApiResponse<CourseRegistration>> {
    const res = await api.put(`/registrations/${idRegistration}/reject`)
    return res.data
  }
}