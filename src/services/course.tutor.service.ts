// Course Tutor service — tutor-specific course operations
// API: GET /tutor/my-courses
import type { ApiResponse, Paginated } from "../types/api"
import type { Course } from "../types/entites/course"
import api from "./api"

export class CourseTutorService {
  static async getMyCourses(query: {
    q?: string
    page?: number
    perPage?: number
  }): Promise<ApiResponse<Paginated<Course>>> {
    const params = new URLSearchParams()
    if (query.q) params.set('q', query.q)
    if (query.page) params.set('page', String(query.page))
    if (query.perPage) params.set('perPage', String(query.perPage))
    const res = await api.get(`/tutor/my-courses?${params.toString()}`)
    return res.data
  }
}
