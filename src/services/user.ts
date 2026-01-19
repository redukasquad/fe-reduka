import type { ApiResponse } from "../types/api";
import type { User } from "../types/entites/user";
import api from "./api";

export class UserService{
    static async findAll() : Promise<
    ApiResponse<User[]>>
    {
        const res=await api.get('/users')
        return res.data
    }
    static async changeRole(user:User) : Promise<any>{
        const res=await api.patch(`/users/${user.ID}/role`,{
            role:user.role
        })

        return res.data
    }
}