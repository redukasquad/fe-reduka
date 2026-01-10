import type {
  ForgotPasswordSchemaType,
  LoginSchemaType,
  RegisterSchemaType,
  VerifyOtpSchemaType,
} from "../schemas/auth"
import api from "../services/api"
import type { ApiResponse } from "../types/api"
import type { User } from "../types/entites/user"

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

  static async verifyOtp(
    value: VerifyOtpSchemaType
  ): Promise<ApiResponse<any>> {
    const res = await api.post("/auth/verify-email",{
      code: value.otp,
      email: value.email,
    })  

    return res.data
  }

  static async resendOtp(email: string) {
    const res= await api.post(
      "/auth/resend-verification",
      {email},
    )

    return res.data
  }

  static async me(): Promise<ApiResponse<User>> {
    const res = await api.get("/auth/me")
    return res.data
  }

}
