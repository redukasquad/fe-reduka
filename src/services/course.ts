import type { ApiResponse } from "../types/api";
import type { Course } from "../types/entites/course";
import api from "./api";

export class CourseService{
    static async findAll() : Promise<
    ApiResponse<Course[]>>
    {
        const res=await api.get('/courses')
        return res.data
    }

    static async findAllRegistrations(id:string) : Promise<
    ApiResponse<Course[]>>
    {
        const res=await api.get(`/courses/${id}/registrations`)
        return res.data
    }
}