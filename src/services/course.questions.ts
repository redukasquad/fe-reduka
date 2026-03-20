import type { ApiResponse } from "../types/api"
import api from "./api"

export interface CourseQuestion {
  id: number
  courseId: number
  questionText: string
  questionType: 'text' | 'select' | 'radio' | 'file'
  questionOrder: number
}

export class CourseQuestionService {
  static async getByCourse(courseId: number): Promise<ApiResponse<CourseQuestion[]>> {
    const res = await api.get(`/courses/${courseId}/questions`)
    return res.data
  }
}
