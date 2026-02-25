import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import './LoginPage.css'

export default function LoginPage() {
  const { login, loginError, user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return (
      <div data-testid="login-page" className="login-container">
        <div className="card login-card">
          <p>Sie sind bereits angemeldet als <strong>{user.email}</strong>.</p>
          <button className="primary" onClick={() => navigate('/')}>
            Zur Startseite
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const success = await login({ email, password })
    setSubmitting(false)

    if (success) {
      const _returnTo = searchParams.get('returnTo')
      navigate('/')
    }
  }

  return (
    <div data-testid="login-page" className="login-container">
      <form className="card login-card" onSubmit={handleSubmit}>
        <h2>Anmelden</h2>

        {loginError && (
          <div role="alert" data-testid="login-error" className="error-banner">
            {loginError}
          </div>
        )}

        <label>
          E-Mail
          <input
            data-testid="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Passwort
          <input
            data-testid="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          data-testid="login-submit"
          type="submit"
          className="primary"
          disabled={submitting}
        >
          {submitting ? 'Anmelden...' : 'Anmelden'}
        </button>
      </form>
    </div>
  )
}
