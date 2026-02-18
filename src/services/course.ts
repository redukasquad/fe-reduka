import type { CreateCourseInput } from "../schemas/course";
import type { ApiResponse, Paginated } from "../types/api";
import type { Course } from "../types/entites/course";
import api from "./api";

export class CourseService{
    static async findAll(query: {
        q: string
        page: number
        perPage: number
    }): Promise<ApiResponse<Paginated<Course>>> {
        const params = new URLSearchParams({
        q: query.q,
        page: String(query.page),
        perPage: String(query.perPage),
        })

        const res = await api.get(`/courses?${params.toString()}`)
        return res.data
    }

    static async findOne(id: number): Promise<ApiResponse<Course>> {
        const res = await api.get(`/courses/${id}`)
        return res.data
    }
    static async delete(id:number) : Promise<
    ApiResponse<Course>>{
        const res=await api.delete(`/courses/${id}`)
        return res.data
    }

    static async create(data:CreateCourseInput) : Promise<
    ApiResponse<Course>>{
        const res=await api.post('/courses', data)
        return res.data
    }
}