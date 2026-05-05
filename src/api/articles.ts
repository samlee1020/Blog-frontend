import { apiData, http } from './http'
import type { ArticleDetailView, ArticleStatus, ArticleSummaryView, PageResponse } from '../types/domain'

export interface ArticleListParams {
  page?: number
  size?: number
  categorySlug?: string
  tagSlug?: string
  keyword?: string
}

export interface AdminArticleListParams {
  page?: number
  size?: number
  status?: ArticleStatus
  keyword?: string
  categoryId?: number
}

export interface ArticlePayload {
  title: string
  slug?: string
  summary?: string
  coverImageUrl?: string
  contentMarkdown: string
  categoryId?: number
  tagIds?: number[]
  status?: ArticleStatus
}

export const articleApi = {
  list(params: ArticleListParams = {}) {
    return apiData<PageResponse<ArticleSummaryView>>(http.get('/articles', { params }))
  },
  detail(slug: string) {
    return apiData<ArticleDetailView>(http.get(`/articles/${slug}`))
  },
  adminList(params: AdminArticleListParams = {}) {
    return apiData<PageResponse<ArticleSummaryView>>(http.get('/admin/articles', { params }))
  },
  adminDetail(id: string | number) {
    return apiData<ArticleDetailView>(http.get(`/admin/articles/${id}`))
  },
  create(payload: ArticlePayload) {
    return apiData<Pick<ArticleSummaryView, 'id' | 'title' | 'slug' | 'status' | 'createdAt' | 'updatedAt'>>(
      http.post('/admin/articles', payload),
    )
  },
  update(id: string | number, payload: ArticlePayload) {
    return apiData<Pick<ArticleSummaryView, 'id' | 'title' | 'slug' | 'status' | 'createdAt' | 'updatedAt'>>(
      http.put(`/admin/articles/${id}`, payload),
    )
  },
  remove(id: number) {
    return apiData<boolean>(http.delete(`/admin/articles/${id}`))
  },
}
