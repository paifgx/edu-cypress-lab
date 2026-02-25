import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { apiFetch } from '@/lib/api'
import RequireAuth from '@/features/auth/RequireAuth'
import type { Application } from '@/lib/types'
import '../applications/ApplicationPages.css'
import './BackofficePages.css'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Entwurf',
  submitted: 'Eingereicht',
  in_review: 'In Pruefung',
  approved: 'Genehmigt',
  rejected: 'Abgelehnt',
}

const TRANSITIONS: Record<string, string[]> = {
  submitted: ['in_review'],
  in_review: ['approved', 'rejected'],
}

function BackofficeDetail() {
  const { id } = useParams<{ id: string }>()
  const [app, setApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    apiFetch<Application>(`/applications/${id}`)
      .then(setApp)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const changeStatus = async (newStatus: string) => {
    setActionError(null)
    try {
      const updated = await apiFetch<Application>(`/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      })
      setApp(updated)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Statusaenderung fehlgeschlagen'
      setActionError(msg)
    }
  }

  if (loading) {
    return (
      <div data-testid="backoffice-detail-page">
        <div data-testid="spinner" className="loading-state">
          <div className="spinner" />
        </div>
      </div>
    )
  }

  if (error || !app) {
    return (
      <div data-testid="backoffice-detail-page">
        <div role="alert" className="error-banner">{error || 'Nicht gefunden'}</div>
      </div>
    )
  }

  const available = TRANSITIONS[app.status] || []

  return (
    <div data-testid="backoffice-detail-page">
      <h2>Antrag {app.id}</h2>

      {actionError && (
        <div role="alert" data-testid="action-error" className="error-banner">
          {actionError}
        </div>
      )}

      <div className="card detail-card">
        <dl className="detail-grid">
          <dt>Programm</dt>
          <dd>{app.programTitle}</dd>
          <dt>Antragsteller</dt>
          <dd>{app.applicantName} ({app.applicantEmail})</dd>
          <dt>Status</dt>
          <dd data-testid="application-status">
            <span className={`status-badge status-${app.status}`}>
              {STATUS_LABELS[app.status] || app.status}
            </span>
          </dd>
          <dt>Erstellt</dt>
          <dd>{new Date(app.createdAt).toLocaleDateString('de-DE')}</dd>
          <dt>Aktualisiert</dt>
          <dd>{new Date(app.updatedAt).toLocaleDateString('de-DE')}</dd>
        </dl>
      </div>

      {available.length > 0 && (
        <div className="status-actions">
          <span>Status aendern:</span>
          {available.map((s) => (
            <button
              key={s}
              data-testid="change-status"
              className={s === 'rejected' ? 'danger' : 'primary'}
              onClick={() => changeStatus(s)}
            >
              {STATUS_LABELS[s] || s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function BackofficeDetailPage() {
  return (
    <RequireAuth role="officer">
      <BackofficeDetail />
    </RequireAuth>
  )
}
