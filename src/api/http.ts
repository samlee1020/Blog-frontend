import axios, { AxiosError } from 'axios'
import { message } from 'antd'
import type { ApiResponse } from '../types/domain'
import { API_BASE_URL } from '../utils/asset'
import { clearStoredAuth, getStoredToken } from '../utils/storage'

let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler
}

export class ApiError extends Error {
  code: string
  status?: number

  constructor(code: string, apiMessage: string, status?: number) {
    super(apiMessage)
    this.code = code
    this.status = status
  }
}

export const http = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/$/, '')}/api`,
  timeout: 15000,
})

http.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => {
    const body = response.data as ApiResponse<unknown>
    if (body?.code && body.code !== 'SUCCESS') {
      throw new ApiError(body.code, body.message || '请求失败', response.status)
    }
    return response
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const status = error.response?.status
    const code = error.response?.data?.code || (status ? String(status) : 'NETWORK_ERROR')
    const apiMessage = error.response?.data?.message || error.message || '网络请求失败'

    if (status === 401 || code === 'UNAUTHORIZED') {
      clearStoredAuth()
      unauthorizedHandler?.()
    }

    throw new ApiError(code, apiMessage, status)
  },
)

export async function apiData<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const response = await request
  return response.data.data
}

export function showApiError(error: unknown) {
  if (error instanceof ApiError) {
    message.error(error.message)
    return
  }
  message.error('操作失败，请稍后再试')
}
