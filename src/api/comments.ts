import { apiData, http } from './http'
import type { CommentStatus, CommentView, PageResponse } from '../types/domain'

export const commentApi = {
  list(slug: string, params = { page: 1, size: 20 }) {
    return apiData<PageResponse<CommentView>>(http.get(`/articles/${slug}/comments`, { params }))
  },
  create(slug: string, content: string) {
    return apiData<CommentView>(http.post(`/articles/${slug}/comments`, { content }))
  },
  adminList(params: {
    page?: number
    size?: number
    status?: CommentStatus
    articleId?: number
    username?: string
  }) {
    return apiData<PageResponse<CommentView>>(http.get('/admin/comments', { params }))
  },
  updateStatus(id: number, status: CommentStatus) {
    return apiData<boolean>(http.patch(`/admin/comments/${id}/status`, { status }))
  },
  remove(id: number) {
    return apiData<boolean>(http.delete(`/admin/comments/${id}`))
  },
}
