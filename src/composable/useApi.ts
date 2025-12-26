import { ref } from "vue"
import type { ApiFunction, ApiMeta } from "../types/api"

export function useApi<TPayload = void, TData = any>(
  apiFn: ApiFunction<TPayload, TData>
) {
  const isLoading = ref(false)
  const data = ref<TData | null>(null)
  const error = ref<any>(null)
  const message = ref("")
  const meta = ref<ApiMeta | null>(null)

  const call = async (payload: TPayload) => {
    isLoading.value = true
    error.value = null
    message.value = ""
    meta.value = null

    try {
      const response = await apiFn(payload)

      message.value = response.message
      meta.value = response.meta ?? null

      if (response.status) {
        data.value = response.data ?? null
      } else {
        error.value = response.error
      }
    } catch (err: any) {
      error.value = err?.response?.data?.error || err
      message.value =
        err?.response?.data?.message || "Terjadi kesalahan"
    } finally {
      isLoading.value = false
    }
  }

  return {
    call,
    isLoading,
    data,
    error,
    message,
    meta,
  }
}
