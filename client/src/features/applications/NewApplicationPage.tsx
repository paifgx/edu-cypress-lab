import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '@/lib/api'
import RequireAuth from '@/features/auth/RequireAuth'
import type { Program } from '@/lib/types'
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
    <div data-testid="application-new-page">
      <h2>Neuen Antrag stellen</h2>

      {success && (
        <div data-testid="toast" className="toast-success">
          Antrag erfolgreich eingereicht!
        </div>
      )}

      {error && (
        <div role="alert" data-testid="form-error" className="error-banner">
          {error}
        </div>
      )}

      <form className="application-form card" onSubmit={handleSubmit}>
        <label>
          Programm
          <select
            data-testid="select-program"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            required
          >
            <option value="">Bitte waehlen...</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </label>

        <label>
          Ihr Name
          <input
            data-testid="input-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          E-Mail
          <input
            data-testid="input-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <button
          data-testid="submit-application"
          type="submit"
          className="primary"
        >
          {submitting ? 'Wird gesendet...' : 'Antrag einreichen'}
        </button>
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
