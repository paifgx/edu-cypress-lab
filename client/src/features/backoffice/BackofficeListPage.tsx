import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '@/lib/api'
import RequireAuth from '@/features/auth/RequireAuth'
import type { Application } from '@/lib/types'
import './BackofficePages.css'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Entwurf',
  submitted: 'Eingereicht',
  in_review: 'In Pruefung',
  approved: 'Genehmigt',
  rejected: 'Abgelehnt',
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
      <div data-testid="backoffice-list-page">
        <h2>Backoffice</h2>
        <div data-testid="spinner" className="loading-state">
          <div className="spinner" />
          <span>Lade Antraege...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div data-testid="backoffice-list-page">
        <h2>Backoffice</h2>
        <div role="alert" data-testid="error-banner" className="error-banner">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div data-testid="backoffice-list-page">
      <h2>Backoffice – Antraege</h2>

      <table className="app-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Programm</th>
            <th>Antragsteller</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a.id} data-testid="application-row">
              <td>{a.id}</td>
              <td>{a.programTitle}</td>
              <td>{a.applicantName}</td>
              <td>
                <span className={`status-badge status-${a.status}`}>
                  {STATUS_LABELS[a.status] || a.status}
                </span>
              </td>
              <td>
                <Link to={`/backoffice/applications/${a.id}`}>Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {applications.length === 0 && (
        <p className="no-results">Keine Antraege vorhanden.</p>
      )}
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
