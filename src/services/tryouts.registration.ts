import type { ApiResponse } from "../types/api"
import type { TryOutRegistration } from "../types/entites/tryout.registration"
import api from "./api"

export class TryoutRegistrationService {
  // User: register for a tryout
  static async register(tryoutId: number): Promise<ApiResponse<TryOutRegistration>> {
    const res = await api.post(`/tryouts/${tryoutId}/register`)
    return res.data
  }

  // User: upload payment proof
  static async uploadPaymentProof(registrationId: number, paymentProofUrl: string): Promise<ApiResponse<TryOutRegistration>> {
    const res = await api.post(`/tryouts/registrations/payment-proof/${registrationId}`, { paymentProofUrl })
    return res.data
  }

  // User: get my registrations
  static async getMyRegistrations(): Promise<ApiResponse<TryOutRegistration[]>> {
    const res = await api.get(`/users/me/tryout-registrations`)
    return res.data
  }

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

  static async deleteRegistration(registrationId: number): Promise<ApiResponse<null>> {
    const res = await api.delete(`/tryouts/registrations/${registrationId}`)
    return res.data
  }
}