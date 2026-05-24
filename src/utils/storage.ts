import type { UserView } from '../types/domain'

const TOKEN_KEY = 'blog.auth.token'
const USER_KEY = 'blog.auth.user'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredAuth(token: string, user: UserView) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function setStoredUser(user: UserView) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getStoredUser(): UserView | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserView
  } catch {
    return null
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
