import { Link } from 'react-router-dom'
import { Search, FileText, Activity, ArrowRight } from 'lucide-react'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div data-testid="landing-page" className="landing-container">
      <section className="hero">
        <div className="hero-content">
          <h2>Willkommen beim Demo Service-Portal</h2>
          <p>Entdecken Sie unsere Programme und stellen Sie Ihren Antrag bequem online.</p>
          <div className="hero-actions">
            <Link to="/programs" className="btn-primary">
              Programme ansehen
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary">
              Anmelden
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card card">
          <div className="feature-icon">
            <Search size={28} />
          </div>
          <h3>Programme finden</h3>
          <p>Uebersicht ueber alle verfuegbaren Service-Programme und Foerdermoeglichkeiten.</p>
        </div>
        <div className="feature-card card">
          <div className="feature-icon">
            <FileText size={28} />
          </div>
          <h3>Online-Antrag</h3>
          <p>Stellen Sie Ihren Antrag bequem digital und sparen Sie wertvolle Zeit.</p>
        </div>
        <div className="feature-card card">
          <div className="feature-icon">
            <Activity size={28} />
          </div>
          <h3>Status verfolgen</h3>
          <p>Verfolgen Sie den Bearbeitungsstand Ihres Antrags jederzeit in Echtzeit.</p>
        </div>
      </section>
    </div>
  )
}
