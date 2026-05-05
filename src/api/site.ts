import { apiData, http } from './http'
import type { CoverView, ProfileView, TagView, CategoryView } from '../types/domain'

export const siteApi = {
  cover() {
    return apiData<CoverView>(http.get('/cover'))
  },
  profile() {
    return apiData<ProfileView>(http.get('/profile'))
  },
  categories() {
    return apiData<CategoryView[]>(http.get('/categories'))
  },
  tags() {
    return apiData<TagView[]>(http.get('/tags'))
  },
}
