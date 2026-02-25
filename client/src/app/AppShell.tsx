import { type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import './AppShell.css'

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div data-testid="app-shell">
      <header data-testid="app-header" className="app-header">
        <h1 data-testid="app-title" className="app-title">
          Demo Service-Portal
        </h1>
        <nav data-testid="app-nav" className="app-nav">
          <NavItem to="/" testId="nav-link-home">Start</NavItem>
          <NavItem to="/programs" testId="nav-link-programs">Programme</NavItem>
          {!user && (
            <NavItem to="/login" testId="nav-link-login">Login</NavItem>
          )}
          {user && (
            <>
              <NavItem to="/applications/new" testId="nav-link-new-application">
                Neuer Antrag
              </NavItem>
              {user.role === 'officer' && (
                <NavItem to="/backoffice/applications" testId="nav-link-backoffice">
                  Backoffice
                </NavItem>
              )}
              <button
                data-testid="logout-button"
                className="nav-logout"
                onClick={handleLogout}
              >
                Abmelden
              </button>
            </>
          )}
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}

function NavItem({
  to,
  testId,
  children,
}: {
  to: string
  testId: string
  children: ReactNode
}) {
  return (
    <NavLink
      to={to}
      data-testid={testId}
      className={({ isActive }) =>
        `app-nav-link${isActive ? ' app-nav-link--active' : ''}`
      }
    >
      {children}
    </NavLink>
  )
}
