import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import type { ReactNode } from 'react'

export default function RequireAuth({ children, role }: { children: ReactNode; role?: string }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
