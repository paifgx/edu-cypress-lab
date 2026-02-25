import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { Mail, Lock, LogIn, AlertCircle, ArrowLeft } from 'lucide-react'
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
        <div className="card login-card already-logged-in">
          <div className="login-header">
            <LogIn size={40} className="login-icon" />
            <h2>Bereits angemeldet</h2>
          </div>
          <p>Sie sind derzeit angemeldet als <strong>{user.email}</strong>.</p>
          <button className="primary login-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
            Zurueck zur Startseite
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
        <div className="login-header">
          <div className="login-icon-wrapper">
            <LogIn size={28} className="login-icon" />
          </div>
          <h2>Willkommen zurueck</h2>
          <p>Bitte melden Sie sich an, um fortzufahren.</p>
        </div>

        {loginError && (
          <div role="alert" data-testid="login-error" className="error-banner">
            <AlertCircle size={18} />
            <span>{loginError}</span>
          </div>
        )}

        <div className="login-form-group">
          <label htmlFor="email">E-Mail Adresse</label>
          <div className="input-with-icon">
            <Mail size={18} className="input-icon" />
            <input
              id="email"
              data-testid="login-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="login-form-group">
          <label htmlFor="password">Passwort</label>
          <div className="input-with-icon">
            <Lock size={18} className="input-icon" />
            <input
              id="password"
              data-testid="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          data-testid="login-submit"
          type="submit"
          className="primary login-btn"
          disabled={submitting}
        >
          {submitting ? 'Wird angemeldet...' : 'Anmelden'}
        </button>

        <div className="login-footer">
          <p>Demo-Accounts: <code>citizen@example.com</code> oder <code>officer@example.com</code> (Passwort: <code>password</code>)</p>
        </div>
      </form>
    </div>
  )
}
