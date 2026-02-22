import type { CreateProgramSchemaType } from "../schemas/programs";
import type { ApiResponse } from "../types/api";
import type { TryOut } from "../types/entites/tryout";
import api from "./api";

export class TryoutService{
    static async findAll() : Promise<
    ApiResponse<TryOut[]>>
    {
        const res=await api.get('/tryouts')
        return res.data
    }
    static async delete(id:number) : Promise<
    ApiResponse<TryOut>>
    {
        const res=await api.delete(`/tryouts/${id}`)
        return res.data
    }

    static async create(data:CreateProgramSchemaType) : Promise<
    ApiResponse<TryOut>>
    {
        const res=await api.post(`/tryouts`, data)
        return res.data
    }
}