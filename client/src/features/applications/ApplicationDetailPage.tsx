import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { apiFetch } from '@/lib/api'
import RequireAuth from '@/features/auth/RequireAuth'
import type { Application } from '@/lib/types'
import './ApplicationPages.css'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Entwurf',
  submitted: 'Eingereicht',
  in_review: 'In Pruefung',
  approved: 'Genehmigt',
  rejected: 'Abgelehnt',
}

function DetailView() {
  const { id } = useParams<{ id: string }>()
  const [app, setApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiFetch<Application>(`/applications/${id}`)
      .then(setApp)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div data-testid="application-detail-page">
        <div data-testid="spinner" className="loading-state">
          <div className="spinner" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div data-testid="application-detail-page">
        <div role="alert" className="error-banner">{error}</div>
      </div>
    )
  }

  if (!app) return null

  return (
    <div data-testid="application-detail-page">
      <h2>Antrag {app.id}</h2>
      <div className="card detail-card">
        <dl className="detail-grid">
          <dt>Programm</dt>
          <dd>{app.programTitle}</dd>
          <dt>Name</dt>
          <dd>{app.applicantName}</dd>
          <dt>E-Mail</dt>
          <dd>{app.applicantEmail}</dd>
          <dt>Status</dt>
          <dd data-testid="application-status">
            <span className={`status-badge status-${app.status}`}>
              {STATUS_LABELS[app.status] || app.status}
            </span>
          </dd>
          <dt>Erstellt</dt>
          <dd>{new Date(app.createdAt).toLocaleDateString('de-DE')}</dd>
        </dl>
      </div>
    </div>
  )
}

export default function ApplicationDetailPage() {
  return (
    <RequireAuth>
      <DetailView />
    </RequireAuth>
  )
}
