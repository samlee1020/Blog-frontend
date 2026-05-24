export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
export const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin'

export function toAssetUrl(url?: string | null) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url
  const base = API_BASE_URL.replace(/\/$/, '')
  return `${base}/${url.replace(/^\//, '')}`
}
