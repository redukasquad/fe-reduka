import type { CreateSubjectInput } from "../schemas/course.subject";
import type { ApiResponse } from "../types/api";
import type { ClassSubject } from "../types/entites/classSubject";
import api from "./api";

export class CourseSubjectService{
    static async findAll(courseId:number) : Promise<
    ApiResponse<ClassSubject[]>>
    {
        const res=await api.get(`/courses/${courseId}/subjects`)
        return res.data.data
    }

    static async create(courseId:number, data:CreateSubjectInput) : Promise<
    ApiResponse<ClassSubject[]>>
    {
        const res=await api.post(`/courses/${courseId}/subjects`, data)
        return res.data.data
    }
     
    static async findOne(id:number) : Promise<
    ApiResponse<ClassSubject>>{
        const res=await api.get(`/subjects/${id}`)
        return res.data
    }

    static async remove(id:number) : Promise<
    ApiResponse<ClassSubject>>{
        const res=await api.delete(`/subjects/${id}`)
        return res.data
    }
}