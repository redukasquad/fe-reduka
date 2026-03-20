import type { ApiResponse } from '../types/api'
import type { University, UniversityMajor, UserTarget } from '../types/entites/university'
import api from './api'

export class UniversityService {
  static async findAll(search = ''): Promise<ApiResponse<University[]>> {
    const res = await api.get('/universities', { params: { q: search } })
    return res.data
  }

  static async findById(id: number): Promise<ApiResponse<University>> {
    const res = await api.get(`/universities/${id}`)
    return res.data
  }

  static async getMajors(universityId: number): Promise<ApiResponse<UniversityMajor[]>> {
    const res = await api.get(`/universities/${universityId}/majors`)
    return res.data
  }
}

export class UserTargetService {
  static async getMyTargets(): Promise<ApiResponse<UserTarget[]>> {
    const res = await api.get('/users/me/targets')
    return res.data
  }

  static async addTarget(universityMajorId: number, priority: number): Promise<ApiResponse<UserTarget>> {
    const res = await api.post('/users/me/targets', { universityMajorId, priority })
    return res.data
  }

  static async deleteTarget(targetId: number): Promise<ApiResponse<null>> {
    const res = await api.delete(`/users/me/targets/${targetId}`)
    return res.data
  }
}
