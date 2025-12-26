export interface ApiMeta {
  timestamp: string
  version: string
  request_id?: string
  page?: number
  limit?: number
  total?: number
}

export interface ApiResponse<T = any> {
  status: boolean
  message: string
  data?: T
  error?: any
  meta?: ApiMeta
}

export type ApiFunction<TPayload, TData> = (
  payload: TPayload
) => Promise<ApiResponse<TData>>
