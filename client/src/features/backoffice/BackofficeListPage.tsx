import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '@/lib/api'
import RequireAuth from '@/features/auth/RequireAuth'
import type { Application } from '@/lib/types'
import { Loader2, AlertCircle, Clock, CheckCircle, XCircle, FileText, ChevronRight } from 'lucide-react'
import './BackofficePages.css'

const STATUS_CONFIG: Record<string, { label: string, icon: any, colorClass: string }> = {
  draft: { label: 'Entwurf', icon: FileText, colorClass: 'status-draft' },
  submitted: { label: 'Eingereicht', icon: Clock, colorClass: 'status-submitted' },
  in_review: { label: 'In Pruefung', icon: Clock, colorClass: 'status-in_review' },
  approved: { label: 'Genehmigt', icon: CheckCircle, colorClass: 'status-approved' },
  rejected: { label: 'Abgelehnt', icon: XCircle, colorClass: 'status-rejected' },
}

function BackofficeList() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiFetch<Application[]>('/applications')
      .then(setApplications)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div data-testid="backoffice-list-page" className="backoffice-container">
        <div className="page-header">
          <h2>Backoffice</h2>
        </div>
        <div data-testid="spinner" className="loading-state">
          <Loader2 className="spinner-icon" size={28} />
          <span>Lade Antraege...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div data-testid="backoffice-list-page" className="backoffice-container">
        <div className="page-header">
          <h2>Backoffice</h2>
        </div>
        <div role="alert" data-testid="error-banner" className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div data-testid="backoffice-list-page" className="backoffice-container">
      <div className="page-header">
        <h2>Backoffice – Antraege</h2>
        <p>Verwalten und bearbeiten Sie alle eingegangenen Antraege.</p>
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          <table className="app-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Programm</th>
                <th>Antragsteller</th>
                <th>Status</th>
                <th className="text-right">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => {
                const statusConfig = STATUS_CONFIG[a.status] || { label: a.status, icon: Clock, colorClass: 'status-draft' }
                const StatusIcon = statusConfig.icon

                return (
                  <tr key={a.id} data-testid="application-row">
                    <td className="font-medium text-muted">{a.id}</td>
                    <td className="font-medium">{a.programTitle}</td>
                    <td>{a.applicantName}</td>
                    <td>
                      <span className={`status-badge ${statusConfig.colorClass}`}>
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link to={`/backoffice/applications/${a.id}`} className="btn-icon">
                        Details <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {applications.length === 0 && (
          <div className="no-results">
            <FileText size={48} className="no-results-icon" />
            <h3>Keine Antraege vorhanden</h3>
            <p>Es wurden bisher keine Antraege eingereicht.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BackofficeListPage() {
  return (
    <RequireAuth role="officer">
      <BackofficeList />
    </RequireAuth>
  )
}
