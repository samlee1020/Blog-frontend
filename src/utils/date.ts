import dayjs from 'dayjs'

export function formatDate(value?: string | null, fallback = '-') {
  if (!value) return fallback
  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : fallback
}

export function formatDateTime(value?: string | null, fallback = '-') {
  if (!value) return fallback
  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format('YYYY-MM-DD HH:mm') : fallback
}
