import { apiData, http } from './http'
import type { PageResponse, ProjectPayload, ProjectStatus, ProjectView } from '../types/domain'

export interface ProjectListParams {
  page?: number
  size?: number
  keyword?: string
}

export interface AdminProjectListParams extends ProjectListParams {
  status?: ProjectStatus
}

export const projectApi = {
  list(params: ProjectListParams = {}) {
    return apiData<PageResponse<ProjectView>>(http.get('/projects', { params }))
  },
  detail(slug: string) {
    return apiData<ProjectView>(http.get(`/projects/${slug}`))
  },
  adminList(params: AdminProjectListParams = {}) {
    return apiData<PageResponse<ProjectView>>(http.get('/admin/projects', { params }))
  },
  adminDetail(id: number | string) {
    return apiData<ProjectView>(http.get(`/admin/projects/${id}`))
  },
  create(payload: ProjectPayload) {
    return apiData<ProjectView>(http.post('/admin/projects', payload))
  },
  update(id: number | string, payload: ProjectPayload) {
    return apiData<ProjectView>(http.put(`/admin/projects/${id}`, payload))
  },
  remove(id: number) {
    return apiData<boolean>(http.delete(`/admin/projects/${id}`))
  },
}
