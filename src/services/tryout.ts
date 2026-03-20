import type { CreateTryOutInput, UpdateTryOutInput } from "../schemas/tryout";
import type { ApiResponse, Paginated } from "../types/api";
import type { TryOut } from "../types/entites/tryout";
import type { TutorPermission } from "../types/entites/tryout.permision";
import api from "./api";

export class TryoutService{
    static async findAll(
    query: {
            q: string
            page: number
            perPage: number
        }
    ) : Promise<ApiResponse<Paginated<TryOut>>> {
        const params = new URLSearchParams({
            q: query.q,
            page: String(query.page),
            perPage: String(query.perPage),
        })
        const res = await api.get(`/tryouts?${params.toString()}`)
        return res.data
    }

    static async findOne(id: number): Promise<ApiResponse<TryOut>> {
        const res = await api.get(`/tryouts/${id}`)
        return res.data
    }

    static async getSubtests(id: number): Promise<ApiResponse<any[]>> {
        const res = await api.get(`/tryouts/${id}/subtests`)
        return res.data
    }

    static async create(data: CreateTryOutInput): Promise<ApiResponse<TryOut>> {
        const res = await api.post(`/tryouts`, data)
        return res.data
    }

    static async update(id: number, data: UpdateTryOutInput): Promise<ApiResponse<TryOut>> {
        const res = await api.put(`/tryouts/${id}`, data)
        return res.data
    }

    static async togglePublish(id: number, isPublished: boolean): Promise<ApiResponse<TryOut>> {
        const res = await api.put(`/tryouts/${id}`, { isPublished })
        return res.data
    }

    static async delete(id: number): Promise<ApiResponse<TryOut>> {
        const res = await api.delete(`/tryouts/${id}`)
        return res.data
    }

    // Tutor permissions
    static async getTutorPermissions(id: number): Promise<ApiResponse<TutorPermission[]>> {
        const res = await api.get(`/tryouts/${id}/tutors`)
        return res.data
    }

    static async grantTutorPermission(id: number, userId: number): Promise<ApiResponse<TutorPermission>> {
        const res = await api.post(`/tryouts/${id}/tutors`, { userId })
        return res.data
    }

    static async revokeTutorPermission(id: number, userId: number): Promise<ApiResponse<null>> {
        const res = await api.delete(`/tryouts/${id}/tutors/${userId}`)
        return res.data
    }
}