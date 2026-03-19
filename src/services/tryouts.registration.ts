import type { ApiResponse } from "../types/api"
import type { TryOutRegistration } from "../types/entites/tryout.registration"
import api from "./api"

export class TryoutRegistrationService {
  static async getRegistration(
    tryoutId: number
  ): Promise<ApiResponse<TryOutRegistration[]>> {
    const res = await api.get(`/tryouts/${tryoutId}/registrations`)
    return res.data
  }

  static async approvePayment(registrationId: number): Promise<ApiResponse<TryOutRegistration>> {
    const res = await api.put(`/tryouts/registrations/${registrationId}/approve`)
    return res.data
  }

  static async rejectPayment(registrationId: number, rejectionReason: string): Promise<ApiResponse<TryOutRegistration>> {
    const res = await api.put(`/tryouts/registrations/${registrationId}/reject`, { rejectionReason })
    return res.data
  }
}