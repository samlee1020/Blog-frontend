import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import { setUnauthorizedHandler } from '../api/http'
import type { LoginResult, UserView } from '../types/domain'
import { clearStoredAuth, getStoredToken, getStoredUser, setStoredAuth, setStoredUser } from '../utils/storage'

interface AuthContextValue {
  user: UserView | null
  token: string | null
  loading: boolean
  isAdmin: boolean
  login: (username: string, password: string) => Promise<LoginResult>
  logout: () => Promise<void>
  refreshMe: () => Promise<void>
  updateUser: (nextUser: UserView) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [user, setUser] = useState<UserView | null>(() => getStoredUser())
  const [loading, setLoading] = useState(Boolean(getStoredToken()))

  const clearAuth = useCallback(() => {
    clearStoredAuth()
    setToken(null)
    setUser(null)
  }, [])

  const refreshMe = useCallback(async () => {
    if (!getStoredToken()) {
      setLoading(false)
      return
    }
    try {
      const nextUser = await authApi.me()
      const storedUser = getStoredUser()
      const userForState = storedUser?.id === nextUser.id ? { ...nextUser, nickname: storedUser.nickname } : nextUser
      setStoredUser(userForState)
      setUser(userForState)
    } catch {
      clearAuth()
    } finally {
      setLoading(false)
    }
  }, [clearAuth])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearAuth()
      if (window.location.pathname.startsWith('/admin')) {
        navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      }
    })
  }, [clearAuth, navigate])

  useEffect(() => {
    void refreshMe()
  }, [refreshMe])

  const login = useCallback(async (username: string, password: string) => {
    const result = await authApi.login({ username, password })
    setStoredAuth(result.token, result.user)
    setToken(result.token)
    setUser(result.user)
    return result
  }, [])

  const updateUser = useCallback((nextUser: UserView) => {
    setStoredUser(nextUser)
    setUser(nextUser)
  }, [])

  const logout = useCallback(async () => {
    try {
      if (getStoredToken()) await authApi.logout()
    } finally {
      clearAuth()
      navigate('/')
    }
  }, [clearAuth, navigate])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAdmin: user?.role === 'ADMIN',
      login,
      logout,
      refreshMe,
      updateUser,
    }),
    [user, token, loading, login, logout, refreshMe, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
