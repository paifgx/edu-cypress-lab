import { Link } from 'react-router-dom'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div data-testid="landing-page">
      <section className="hero">
        <h2>Willkommen beim Demo Service-Portal</h2>
        <p>Entdecken Sie unsere Programme und stellen Sie Ihren Antrag online.</p>
        <div className="hero-actions">
          <Link to="/programs" className="btn-primary">
            Programme ansehen
          </Link>
          <Link to="/login" className="btn-secondary">
            Anmelden
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card card">
          <h3>Programme</h3>
          <p>Uebersicht ueber alle verfuegbaren Service-Programme.</p>
        </div>
        <div className="feature-card card">
          <h3>Online-Antrag</h3>
          <p>Stellen Sie Ihren Antrag bequem digital.</p>
        </div>
        <div className="feature-card card">
          <h3>Status verfolgen</h3>
          <p>Verfolgen Sie den Bearbeitungsstand jederzeit.</p>
        </div>
      </section>
    </div>
  )
}
