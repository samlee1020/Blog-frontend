import { apiData, http } from './http'
import type { LoginResult, UserView } from '../types/domain'

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  nickname?: string
}

export const authApi = {
  login(payload: LoginPayload) {
    return apiData<LoginResult>(http.post('/auth/login', payload))
  },
  registerGuest(payload: RegisterPayload) {
    return apiData<UserView>(http.post('/auth/guest/register', payload))
  },
  me() {
    return apiData<UserView>(http.get('/auth/me'))
  },
  logout() {
    return apiData<boolean>(http.post('/auth/logout'))
  },
}
