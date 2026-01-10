import type { ApiResponse } from "../types/api";
import api from "./api";

export class ProgramService{
    static async findAll() : Promise<
    ApiResponse<any>>
    {
        const res=await api.get('/programs')
        return res.data
    }
}