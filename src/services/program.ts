import type { ApiResponse } from "../types/api";
import type { Program } from "../types/entites/program";
import api from "./api";

export class ProgramService{
    static async findAll() : Promise<
    ApiResponse<Program[]>>
    {
        const res=await api.get('/programs')
        return res.data
    }
}