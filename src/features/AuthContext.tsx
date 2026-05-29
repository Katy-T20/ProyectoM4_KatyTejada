import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { authService } from '../services/authService'
import type { User } from '../types'
import type { AuthContextValue } from './authTypes'

//Contexto
const AuthContext = createContext<AuthContextValue | null>(null)

//Proveedor
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

//Hook de acceso
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
