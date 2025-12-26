import type {
  ForgotPasswordSchemaType,
  LoginSchemaType,
  RegisterSchemaType,
} from "../schemas/auth"
import api from "../services/api"
import type { ApiResponse } from "../types/api"
import type { User } from "../types/user"

export class AuthService {
  static async register(
    value: Partial<RegisterSchemaType>
  ): Promise<ApiResponse<User>> {
    const res = await api.post("/auth/register", value)
    return res.data
  }

  static async login(
    value: LoginSchemaType
  ): Promise<ApiResponse<{ token: string }>> {
    const res = await api.post("/auth/login", value)
    return res.data
  }

  static async forgotPassword(
    value: ForgotPasswordSchemaType
  ): Promise<ApiResponse<any>> {
    const res = await api.post("/auth/reset-password", value)
    return res.data
  }

  static loginGoogle() {
    window.location.href =
      import.meta.env.VITE_API_BASE_URL + "/auth/google/login"
  }
}
