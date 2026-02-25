import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth'
import AppShell from '@/app/AppShell'
import LandingPage from '@/features/landing/LandingPage'
import ProgramsPage from '@/features/programs/ProgramsPage'
import LoginPage from '@/features/auth/LoginPage'
import NewApplicationPage from '@/features/applications/NewApplicationPage'
import ApplicationDetailPage from '@/features/applications/ApplicationDetailPage'
import BackofficeListPage from '@/features/backoffice/BackofficeListPage'
import BackofficeDetailPage from '@/features/backoffice/BackofficeDetailPage'
import NotFoundPage from '@/features/errors/NotFoundPage'

export default function App() {
  return (
    <AuthProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/applications/new" element={<NewApplicationPage />} />
          <Route path="/applications/:id" element={<ApplicationDetailPage />} />
          <Route path="/backoffice/applications" element={<BackofficeListPage />} />
          <Route path="/backoffice/applications/:id" element={<BackofficeDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </AuthProvider>
  )
}
