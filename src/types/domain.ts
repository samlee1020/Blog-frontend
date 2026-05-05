export type UserRole = 'ADMIN' | 'GUEST'
export type UserStatus = 'ACTIVE' | 'DISABLED'
export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN'
export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN'
export type CommentStatus = 'VISIBLE' | 'HIDDEN' | 'PENDING'
export type MediaUsageType = 'ARTICLE' | 'COVER' | 'PROFILE' | 'PROJECT' | 'OTHER'
export type ValueType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON'

export interface ApiResponse<T> {
  code: string
  message: string
  data: T
}

export interface PageResponse<T> {
  items: T[]
  page: number
  size: number
  total: number
  pages: number
}

export interface UserView {
  id: number
  username: string
  nickname: string
  role: UserRole
}

export interface GuestView {
  id: number
  username: string
  nickname: string
  status: UserStatus
  lastLoginAt?: string | null
  createdAt?: string
}

export interface CategoryView {
  id: number
  name: string
  slug: string
  description?: string | null
  sortOrder?: number
}

export interface TagView {
  id: number
  name: string
  slug: string
}

export interface ArticleSummaryView {
  id: number
  title: string
  slug: string
  summary?: string | null
  coverImageUrl?: string | null
  category?: CategoryView | null
  tags?: TagView[]
  status?: ArticleStatus
  publishedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface ArticleDetailView extends ArticleSummaryView {
  contentMarkdown: string
  contentHtml?: string | null
}

export interface LinkItem {
  label: string
  url: string
  type?: 'internal' | 'external' | string
  sortOrder?: number
}

export interface CoverView {
  title: string
  subtitle?: string | null
  backgroundImageUrl?: string | null
  avatarImageUrl?: string | null
  links?: LinkItem[]
}

export interface ProfileView {
  displayName: string
  bio?: string | null
  avatarImageUrl?: string | null
  email?: string | null
  location?: string | null
  socialLinks?: LinkItem[]
  contentMarkdown?: string | null
}

export interface CommentView {
  id: number
  articleId?: number
  articleTitle?: string
  content: string
  status?: CommentStatus
  author: Pick<UserView, 'id' | 'username' | 'nickname'>
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export interface MediaAssetView {
  id: number
  originalFilename: string
  contentType: string
  fileSize: number
  usageType: MediaUsageType
  url: string
  createdAt: string
}

export interface SystemConfigView {
  configKey: string
  configValue?: string | null
  valueType: ValueType
  description?: string | null
  updatedAt?: string
}

export interface LoginResult {
  token: string
  expiresIn: number
  user: UserView
}

export interface ProjectView {
  id: number
  title: string
  slug: string
  detailUrl: string
  description?: string | null
  contentMarkdown?: string | null
  imageUrl?: string | null
  projectUrl?: string | null
  tags: string[]
  sortOrder: number
  status: ProjectStatus
  createdAt?: string
  updatedAt?: string
}

export interface ProjectPayload {
  title: string
  slug?: string
  description?: string
  contentMarkdown?: string
  imageUrl?: string
  projectUrl?: string
  tags?: string[]
  sortOrder?: number
  status?: ProjectStatus
}
