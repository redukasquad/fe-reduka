export interface ApiResponse<T = any> {
  status: boolean
  message: string
  data?: T
  error?: any
}

export type ApiFunction<TPayload, TData> = (
  payload: TPayload
) => Promise<ApiResponse<TData>>

export interface Paginated<T> {
  data: T[]
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}
