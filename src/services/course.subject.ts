import type { CreateSubjectInput, UpdateSubjectInput } from "../schemas/course.subject";
import type { ApiResponse } from "../types/api";
import type { ClassSubject } from "../types/entites/classSubject";
import api from "./api";

export class CourseSubjectService{
    static async findAll(courseId: number): Promise<ApiResponse<ClassSubject[]>> {
        const res = await api.get(`/courses/${courseId}/classes`)
        return res.data
    }

    static async create(courseId: number, data: CreateSubjectInput): Promise<ApiResponse<ClassSubject>> {
        const res = await api.post(`/courses/${courseId}/classes`, data)
        return res.data
    }

    static async findOne(id: number): Promise<ApiResponse<ClassSubject>> {
        const res = await api.get(`/classes/${id}`)
        return res.data
    }

    static async update(id: number, data: UpdateSubjectInput): Promise<ApiResponse<ClassSubject>> {
        const res = await api.put(`/classes/${id}`, data)
        return res.data
    }

    static async remove(id: number): Promise<ApiResponse<ClassSubject>> {
        const res = await api.delete(`/classes/${id}`)
        return res.data
    }
}