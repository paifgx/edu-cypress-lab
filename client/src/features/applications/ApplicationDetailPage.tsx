import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiFetch } from '@/lib/api'
import RequireAuth from '@/features/auth/RequireAuth'
import type { Application } from '@/lib/types'
import { Loader2, AlertCircle, ArrowLeft, Clock, CheckCircle, XCircle, FileText, User, Calendar } from 'lucide-react'
import './ApplicationPages.css'

const STATUS_CONFIG: Record<string, { label: string, icon: any, colorClass: string }> = {
  draft: { label: 'Entwurf', icon: FileText, colorClass: 'status-draft' },
  submitted: { label: 'Eingereicht', icon: Clock, colorClass: 'status-submitted' },
  in_review: { label: 'In Pruefung', icon: Clock, colorClass: 'status-in_review' },
  approved: { label: 'Genehmigt', icon: CheckCircle, colorClass: 'status-approved' },
  rejected: { label: 'Abgelehnt', icon: XCircle, colorClass: 'status-rejected' },
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
      <div data-testid="application-detail-page" className="loading-state">
        <Loader2 className="spinner-icon" size={28} />
        <span>Lade Antragsdetails...</span>
      </div>
    )
  }

  if (error || !app) {
    return (
      <div data-testid="application-detail-page">
        <div role="alert" className="error-banner">
          <AlertCircle size={20} />
          <span>{error || 'Antrag nicht gefunden'}</span>
        </div>
        <Link to="/" className="btn-secondary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
          <ArrowLeft size={18} /> Zurueck
        </Link>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[app.status] || { label: app.status, icon: Clock, colorClass: 'status-draft' }
  const StatusIcon = statusConfig.icon

  return (
    <div data-testid="application-detail-page" className="application-container">
      <div className="page-header with-back">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} />
          Zurueck
        </Link>
        <div className="header-title-row">
          <h2>Antrag {app.id}</h2>
          <span className={`status-badge ${statusConfig.colorClass}`} data-testid="application-status">
            <StatusIcon size={14} />
            {statusConfig.label}
          </span>
        </div>
      </div>

      <div className="card detail-card">
        <div className="detail-section">
          <h3><FileText size={18} /> Programminformationen</h3>
          <dl className="detail-grid">
            <dt>Programm</dt>
            <dd className="font-medium">{app.programTitle}</dd>
            <dt>Programm-ID</dt>
            <dd className="text-muted">{app.programId}</dd>
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
            <dt>Eingereicht am</dt>
            <dd>{new Date(app.createdAt).toLocaleString('de-DE')}</dd>
            <dt>Letzte Aenderung</dt>
            <dd>{new Date(app.updatedAt).toLocaleString('de-DE')}</dd>
          </dl>
        </div>
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
