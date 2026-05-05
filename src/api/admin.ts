import { apiData, http } from './http'
import type {
  CategoryView,
  CoverView,
  GuestView,
  PageResponse,
  ProfileView,
  SystemConfigView,
  TagView,
  UserStatus,
} from '../types/domain'

export const adminApi = {
  createCategory(payload: Partial<CategoryView>) {
    return apiData<CategoryView>(http.post('/admin/categories', payload))
  },
  updateCategory(id: number, payload: Partial<CategoryView>) {
    return apiData<boolean>(http.put(`/admin/categories/${id}`, payload))
  },
  removeCategory(id: number) {
    return apiData<boolean>(http.delete(`/admin/categories/${id}`))
  },
  createTag(payload: Partial<TagView>) {
    return apiData<TagView>(http.post('/admin/tags', payload))
  },
  updateTag(id: number, payload: Partial<TagView>) {
    return apiData<boolean>(http.put(`/admin/tags/${id}`, payload))
  },
  removeTag(id: number) {
    return apiData<boolean>(http.delete(`/admin/tags/${id}`))
  },
  guests(params: { page?: number; size?: number; username?: string }) {
    return apiData<PageResponse<GuestView>>(http.get('/admin/guests', { params }))
  },
  resetGuestPassword(id: number, newPassword: string) {
    return apiData<boolean>(http.patch(`/admin/guests/${id}/password`, { newPassword }))
  },
  updateGuestStatus(id: number, status: UserStatus) {
    return apiData<boolean>(http.patch(`/admin/guests/${id}/status`, { status }))
  },
  adminCover() {
    return apiData<CoverView>(http.get('/admin/cover'))
  },
  updateCover(payload: CoverView) {
    return apiData<CoverView>(http.put('/admin/cover', payload))
  },
  adminProfile() {
    return apiData<ProfileView>(http.get('/admin/profile'))
  },
  updateProfile(payload: ProfileView) {
    return apiData<ProfileView>(http.put('/admin/profile', payload))
  },
  systemConfigs() {
    return apiData<SystemConfigView[]>(http.get('/admin/system-configs'))
  },
  updateSystemConfig(configKey: string, payload: Pick<SystemConfigView, 'configValue' | 'valueType' | 'description'>) {
    return apiData<SystemConfigView>(http.put(`/admin/system-configs/${configKey}`, payload))
  },
  changePassword(payload: { oldPassword: string; newPassword: string }) {
    return apiData<boolean>(http.patch('/admin/me/password', payload))
  },
}
