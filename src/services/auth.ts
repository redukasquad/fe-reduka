import type { ForgotPasswordSchemaType, LoginSchemaType, RegisterSchemaType, } from "../schemas/auth";
import api from "../services/api";
import type { ApiResponse } from "../types/api";

export class AuthService {
  static register(value: RegisterSchemaType) : any{
    return api.post('/auth/register', value);
  }

  static login(value:LoginSchemaType):any{
    return api.post('/auth/login', value)
  }

  static forgotPassword(value:ForgotPasswordSchemaType):any{
    return api.post('/auth/reset-password', value)
  }
}