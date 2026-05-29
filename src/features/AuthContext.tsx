/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, type ReactNode } from 'react'
import { authService } from '../services/authService'
import type { User } from '../types'
import type { AuthContextValue } from './authTypes'

export const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() =>
    authService.getCurrentUser()
  )

  const login = useCallback(async (email: string, password: string) => {
    const u = authService.login(email, password)
    setUser(u)
  }, [])

  const register = useCallback(async (
    name: string,
    email: string,
    password: string
  ) => {
    const u = authService.register(name, email, password)
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
