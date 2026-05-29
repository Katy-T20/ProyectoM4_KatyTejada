import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function PublicOnlyRoute({ children }: Props) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) return <Navigate to="/tasks" replace />

  return <>{children}</>
}
