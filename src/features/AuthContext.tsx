/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { authService } from '../services/authService'
import type { User } from '../types'
import type { AuthContextValue } from './authTypes'

export const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Escuchar cambios de sesión de Firebase
  useEffect(() => {
    const unsubscribe = authService.onAuthChange(fbUser => {
      setUser(fbUser)
      setIsLoading(false)
    })
    return unsubscribe
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const u = await authService.login(email, password)
    setUser(u)
  }, [])

  const loginWithGoogle = useCallback(async () => {
  const u = await authService.loginWithGoogle()
  setUser(u)
}, [])

  const register = useCallback(async (
    name: string,
    email: string,
    password: string
  ) => {
    const u = await authService.register(name, email, password)
    setUser(u)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  // Mientras Firebase verifica la sesión no renderizar
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'DM Mono, monospace',
        fontSize: '12px',
        letterSpacing: '2px',
        color: '#C026D3',
      }}>
        CARGANDO...
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
