import { type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { 
  LayoutDashboard, 
  Home, 
  List, 
  LogIn, 
  FilePlus, 
  Briefcase, 
  LogOut 
} from 'lucide-react'
import './AppShell.css'

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div data-testid="app-shell" className="app-layout">
      <header data-testid="app-header" className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <LayoutDashboard className="app-logo" size={24} />
            <h1 data-testid="app-title" className="app-title">
              Demo Service-Portal
            </h1>
          </div>
          
          <nav data-testid="app-nav" className="app-nav">
            <NavItem to="/" testId="nav-link-home" icon={<Home size={18} />}>
              Start
            </NavItem>
            <NavItem to="/programs" testId="nav-link-programs" icon={<List size={18} />}>
              Programme
            </NavItem>
            {!user && (
              <NavItem to="/login" testId="nav-link-login" icon={<LogIn size={18} />}>
                Login
              </NavItem>
            )}
            {user && (
              <>
                <NavItem to="/applications/new" testId="nav-link-new-application" icon={<FilePlus size={18} />}>
                  Neuer Antrag
                </NavItem>
                {user.role === 'officer' && (
                  <NavItem to="/backoffice/applications" testId="nav-link-backoffice" icon={<Briefcase size={18} />}>
                    Backoffice
                  </NavItem>
                )}
                <button
                  data-testid="logout-button"
                  className="nav-logout"
                  onClick={handleLogout}
                  title="Abmelden"
                >
                  <LogOut size={18} />
                  <span>Abmelden</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}

function NavItem({
  to,
  testId,
  icon,
  children,
}: {
  to: string
  testId: string
  icon: ReactNode
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
      {icon}
      <span>{children}</span>
    </NavLink>
  )
}
