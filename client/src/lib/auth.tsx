import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { apiFetch } from '@/lib/api'
import type { User, LoginCredentials } from '@/lib/types'

interface AuthContextValue {
  user: User | null
  loginError: string | null
  login: (creds: LoginCredentials) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loginError, setLoginError] = useState<string | null>(null)

  const login = useCallback(async (creds: LoginCredentials) => {
    try {
      const data = await apiFetch<User>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(creds),
      })
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data))
      setUser(data)
      return true
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Login fehlgeschlagen'
      setLoginError(msg)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setUser(null)
    setLoginError(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loginError, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
