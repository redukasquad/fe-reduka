import type { LoginSchemaType, RegisterSchemaType, ResetPasswordSchemaType } from "../schemas/auth";
import api from "../services/api";

export class AuthService {
  static register(value: RegisterSchemaType) {
    return api.post('/auth/register', value);
  }

  static login(value:LoginSchemaType){
    return api.post('/auth/login', value)
  }

  static resetPassword(value:ResetPasswordSchemaType){
    return api.post('/auth/reset-password', value)
  }
}
