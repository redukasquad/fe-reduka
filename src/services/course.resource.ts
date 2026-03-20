import type { ApiResponse } from "../types/api"
import api from "./api"

export type ResourceType = 'video' | 'document' | 'link' | 'zoom' | 'recording'

export interface LessonResource {
  id: number
  lessonId: number
  lessonTitle?: string
  type: ResourceType
  title: string
  url: string
}

export interface CreateResourceInput {
  type: ResourceType
  title: string
  url: string
}

export class CourseResourceService {
  static async findByLesson(lessonId: number): Promise<ApiResponse<LessonResource[]>> {
    const res = await api.get(`/lessons/${lessonId}/resources`)
    return res.data
  }

  static async create(lessonId: number, data: CreateResourceInput): Promise<ApiResponse<LessonResource>> {
    const res = await api.post(`/lessons/${lessonId}/resources`, data)
    return res.data
  }

  static async update(id: number, data: Partial<CreateResourceInput>): Promise<ApiResponse<LessonResource>> {
    const res = await api.put(`/resources/${id}`, data)
    return res.data
  }

  static async remove(id: number): Promise<ApiResponse<LessonResource>> {
    const res = await api.delete(`/resources/${id}`)
    return res.data
  }
}
