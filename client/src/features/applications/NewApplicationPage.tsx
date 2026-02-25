import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '@/lib/api'
import RequireAuth from '@/features/auth/RequireAuth'
import type { Program } from '@/lib/types'
import { CheckCircle2, AlertCircle, FileText, User, Mail, Send } from 'lucide-react'
import './ApplicationPages.css'

function NewApplicationForm() {
  const navigate = useNavigate()
  const [programs, setPrograms] = useState<Program[]>([])
  const [selectedProgram, setSelectedProgram] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    apiFetch<Program[]>('/programs').then(setPrograms).catch(() => {})
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await apiFetch('/applications', {
        method: 'POST',
        body: JSON.stringify({
          programId: selectedProgram,
          applicantName: name,
          applicantEmail: email,
        }),
      })
      setSuccess(true)
      setTimeout(() => navigate('/'), 1500)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Fehler beim Absenden'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div data-testid="application-new-page" className="application-container">
      <div className="page-header">
        <h2>Neuen Antrag stellen</h2>
        <p>Bitte fuellen Sie das Formular vollstaendig aus, um Ihren Antrag einzureichen.</p>
      </div>

      {success && (
        <div data-testid="toast" className="toast-success">
          <CheckCircle2 size={20} />
          <span>Antrag erfolgreich eingereicht! Sie werden weitergeleitet...</span>
        </div>
      )}

      {error && (
        <div role="alert" data-testid="form-error" className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form className="application-form card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="program">
            <FileText size={16} />
            Programm auswaehlen
          </label>
          <select
            id="program"
            data-testid="select-program"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            required
          >
            <option value="" disabled>Bitte waehlen...</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="name">
            <User size={16} />
            Ihr vollstaendiger Name
          </label>
          <input
            id="name"
            data-testid="input-name"
            type="text"
            placeholder="Max Mustermann"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <Mail size={16} />
            E-Mail Adresse
          </label>
          <input
            id="email"
            data-testid="input-email"
            type="email"
            placeholder="max@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-actions">
          <button
            data-testid="submit-application"
            type="submit"
            className="primary submit-btn"
          >
            <Send size={18} />
            {submitting ? 'Wird gesendet...' : 'Antrag einreichen'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function NewApplicationPage() {
  return (
    <RequireAuth>
      <NewApplicationForm />
    </RequireAuth>
  )
}
