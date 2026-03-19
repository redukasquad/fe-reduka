import type { ApiResponse } from "../types/api"
import type { User } from "../types/entites/user"
import api from "./api"

export interface CreateUserInput {
  username: string
  email: string
  password: string
}

export class UserService {
  static async findAll(): Promise<ApiResponse<User[]>> {
    const res = await api.get('/users')
    return res.data
  }

  // Admin creates user via auth/register endpoint
  static async create(data: CreateUserInput): Promise<ApiResponse<User>> {
    const res = await api.post('/auth/register', data)
    return res.data
  }

  static async setRole(userId: number, role: string): Promise<ApiResponse<User>> {
    const res = await api.patch(`/users/${userId}/role`, { role })
    return res.data
  }

  static async delete(userId: number): Promise<ApiResponse<null>> {
    const res = await api.delete(`/users/${userId}`)
    return res.data
  }
}
