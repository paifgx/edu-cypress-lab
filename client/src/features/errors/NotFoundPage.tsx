import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div data-testid="not-found-page" style={{ textAlign: 'center', padding: '3rem 0' }}>
      <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>404</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Diese Seite existiert leider nicht.
      </p>
      <Link to="/" style={{
        display: 'inline-block',
        padding: '0.5rem 1.25rem',
        background: 'var(--color-primary)',
        color: 'white',
        borderRadius: 'var(--radius)',
        fontWeight: 600,
      }}>
        Zur Startseite
      </Link>
    </div>
  )
}
