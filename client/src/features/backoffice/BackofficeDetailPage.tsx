import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiFetch } from '@/lib/api'
import RequireAuth from '@/features/auth/RequireAuth'
import type { Application } from '@/lib/types'
import { Loader2, AlertCircle, ArrowLeft, Clock, CheckCircle, XCircle, FileText, User, Calendar, Edit3 } from 'lucide-react'
import '../applications/ApplicationPages.css'
import './BackofficePages.css'

const STATUS_CONFIG: Record<string, { label: string, icon: any, colorClass: string }> = {
  draft: { label: 'Entwurf', icon: FileText, colorClass: 'status-draft' },
  submitted: { label: 'Eingereicht', icon: Clock, colorClass: 'status-submitted' },
  in_review: { label: 'In Pruefung', icon: Clock, colorClass: 'status-in_review' },
  approved: { label: 'Genehmigt', icon: CheckCircle, colorClass: 'status-approved' },
  rejected: { label: 'Abgelehnt', icon: XCircle, colorClass: 'status-rejected' },
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
      <div data-testid="backoffice-detail-page" className="loading-state">
        <Loader2 className="spinner-icon" size={28} />
        <span>Lade Antragsdetails...</span>
      </div>
    )
  }

  if (error || !app) {
    return (
      <div data-testid="backoffice-detail-page" className="backoffice-container">
        <div role="alert" className="error-banner">
          <AlertCircle size={20} />
          <span>{error || 'Nicht gefunden'}</span>
        </div>
        <Link to="/backoffice/applications" className="btn-secondary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
          <ArrowLeft size={18} /> Zurueck zur Liste
        </Link>
      </div>
    )
  }

  const available = TRANSITIONS[app.status] || []
  const statusConfig = STATUS_CONFIG[app.status] || { label: app.status, icon: Clock, colorClass: 'status-draft' }
  const StatusIcon = statusConfig.icon

  return (
    <div data-testid="backoffice-detail-page" className="backoffice-container">
      <div className="page-header with-back">
        <Link to="/backoffice/applications" className="back-link">
          <ArrowLeft size={18} />
          Zurueck zur Liste
        </Link>
        <div className="header-title-row">
          <h2>Antrag {app.id}</h2>
          <span className={`status-badge ${statusConfig.colorClass}`} data-testid="application-status">
            <StatusIcon size={14} />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {actionError && (
        <div role="alert" data-testid="action-error" className="error-banner">
          <AlertCircle size={20} />
          <span>{actionError}</span>
        </div>
      )}

      <div className="card detail-card">
        <div className="detail-section">
          <h3><FileText size={18} /> Programminformationen</h3>
          <dl className="detail-grid">
            <dt>Programm</dt>
            <dd className="font-medium">{app.programTitle}</dd>
          </dl>
        </div>

        <div className="detail-divider" />

        <div className="detail-section">
          <h3><User size={18} /> Antragsteller</h3>
          <dl className="detail-grid">
            <dt>Name</dt>
            <dd>{app.applicantName}</dd>
            <dt>E-Mail</dt>
            <dd>{app.applicantEmail}</dd>
          </dl>
        </div>

        <div className="detail-divider" />

        <div className="detail-section">
          <h3><Calendar size={18} /> Historie</h3>
          <dl className="detail-grid">
            <dt>Erstellt am</dt>
            <dd>{new Date(app.createdAt).toLocaleString('de-DE')}</dd>
            <dt>Aktualisiert am</dt>
            <dd>{new Date(app.updatedAt).toLocaleString('de-DE')}</dd>
          </dl>
        </div>

        {available.length > 0 && (
          <>
            <div className="detail-divider" />
            <div className="detail-section status-actions-container">
              <h3><Edit3 size={18} /> Aktionen</h3>
              <div className="status-actions">
                <span className="action-label">Status aendern:</span>
                <div className="action-buttons">
                  {available.map((s) => {
                    const btnConfig = STATUS_CONFIG[s]
                    const BtnIcon = btnConfig?.icon || Edit3
                    return (
                      <button
                        key={s}
                        data-testid="change-status"
                        className={s === 'rejected' ? 'danger' : 'primary'}
                        onClick={() => changeStatus(s)}
                      >
                        <BtnIcon size={16} />
                        {btnConfig?.label || s}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
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
