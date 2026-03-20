// Class service — manages Classes within a Course
// API: GET/POST /courses/:id/classes, GET/PUT/DELETE /classes/:id
import type { ApiResponse } from "../types/api"
import type { Class } from "../types/entites/class"
import api from "./api"

export interface CreateClassInput {
  name: string
  description?: string
}

export interface UpdateClassInput {
  name?: string
  description?: string
}

export class ClassService {
  static async findByCourse(courseId: number): Promise<ApiResponse<Class[]>> {
    const res = await api.get(`/courses/${courseId}/classes`)
    return res.data
  }

  static async findOne(id: number): Promise<ApiResponse<Class>> {
    const res = await api.get(`/classes/${id}`)
    return res.data
  }

  static async create(courseId: number, data: CreateClassInput): Promise<ApiResponse<Class>> {
    const res = await api.post(`/courses/${courseId}/classes`, data)
    return res.data
  }

  static async update(id: number, data: UpdateClassInput): Promise<ApiResponse<Class>> {
    const res = await api.put(`/classes/${id}`, data)
    return res.data
  }

  static async remove(id: number): Promise<ApiResponse<Class>> {
    const res = await api.delete(`/classes/${id}`)
    return res.data
  }
}
