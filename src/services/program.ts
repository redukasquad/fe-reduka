import type { CreateProgramSchemaType } from "../schemas/programs";
import type { ApiResponse } from "../types/api";
import type { Program } from "../types/entites/program";
import api from "./api";

export class ProgramService {
  static async findAll(): Promise<ApiResponse<Program[]>> {
    const res = await api.get('/programs')
    return res.data
  }

  static async findOne(id: number): Promise<ApiResponse<Program>> {
    const res = await api.get(`/programs/${id}`)
    return res.data
  }

  static async delete(id: number): Promise<ApiResponse<Program[]>> {
    const res = await api.delete(`/programs/${id}`)
    return res.data
  }

  static async create(data: CreateProgramSchemaType): Promise<ApiResponse<Program>> {
    const res = await api.post(`/programs`, data)
    return res.data
  }

  static async update(id: number, data: CreateProgramSchemaType): Promise<ApiResponse<Program>> {
    const res = await api.put(`/programs/${id}`, data)
    return res.data
  }
}
