import { apiData, http } from './http'
import type { MediaAssetView, MediaUsageType, PageResponse } from '../types/domain'

export const mediaApi = {
  upload(file: File, usageType: MediaUsageType) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('usageType', usageType)
    return apiData<MediaAssetView>(http.post('/admin/media/images', formData))
  },
  list(params: { page?: number; size?: number; usageType?: MediaUsageType } = {}) {
    return apiData<PageResponse<MediaAssetView>>(http.get('/admin/media/images', { params }))
  },
  remove(id: number) {
    return apiData<boolean>(http.delete(`/admin/media/images/${id}`))
  },
}
