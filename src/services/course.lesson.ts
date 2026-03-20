import type { ApiResponse } from "../types/api"
import type { ClassLesson } from "../types/entites/classLesson"
import api from "./api"

export interface CreateLessonInput {
  title: string
  description?: string
  lessonOrder: number
  startTime?: string | null
  endTime?: string | null
}

export interface UpdateLessonInput {
  title?: string
  description?: string
  lessonOrder?: number
  startTime?: string | null
  endTime?: string | null
}

export class CourseLessonService {
  static async findByClass(classId: number): Promise<ApiResponse<ClassLesson[]>> {
    const res = await api.get(`/classes/${classId}/lessons`)
    return res.data
  }

  static async findOne(id: number): Promise<ApiResponse<ClassLesson>> {
    const res = await api.get(`/lessons/${id}`)
    return res.data
  }

  static async create(classId: number, data: CreateLessonInput): Promise<ApiResponse<ClassLesson>> {
    const res = await api.post(`/classes/${classId}/lessons`, data)
    return res.data
  }

  static async update(id: number, data: UpdateLessonInput): Promise<ApiResponse<ClassLesson>> {
    const res = await api.put(`/lessons/${id}`, data)
    return res.data
  }

  static async remove(id: number): Promise<ApiResponse<ClassLesson>> {
    const res = await api.delete(`/lessons/${id}`)
    return res.data
  }
}
