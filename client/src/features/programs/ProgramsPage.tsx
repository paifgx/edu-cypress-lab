import { useState, useEffect, useRef } from 'react'
import { apiFetch } from '@/lib/api'
import type { Program } from '@/lib/types'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import './ProgramsPage.css'

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [filtered, setFiltered] = useState<Program[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    setLoading(true)
    apiFetch<Program[]>('/programs')
      .then((data) => {
        setPrograms(data)
        setFiltered(data)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleFilterChange = (value: string) => {
    setFilter(value)
    clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      if (value.length > 1) {
        apiFetch<Program[]>(`/programs?q=${encodeURIComponent(value)}`)
          .then(setFiltered)
          .catch(() => {})
      } else {
        setFiltered(programs)
      }
    }, 300)
  }

  return (
    <div data-testid="programs-page" className="programs-container">
      <div className="programs-header">
        <h2>Verfuegbare Programme</h2>
        <p>Finden Sie das passende Service-Programm fuer Ihr Anliegen.</p>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            data-testid="filter-input"
            type="text"
            placeholder="Programme durchsuchen..."
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div data-testid="spinner" className="loading-state">
          <Loader2 className="spinner-icon" size={28} />
          <span>Lade Programme...</span>
        </div>
      )}

      {error && (
        <div role="alert" data-testid="error-banner" className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div data-testid="results" className="programs-grid">
          {filtered.map((p) => (
            <div key={p.id} data-testid="program-card" className="card program-card">
              <div className="program-card-header">
                <span className="program-category">{p.category}</span>
                {p.id && <span data-testid="program-id" className="program-id">{p.id}</span>}
              </div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="no-results card">
              <Search size={48} className="no-results-icon" />
              <h3>Keine Programme gefunden</h3>
              <p>Es gibt leider keine Programme, die zu Ihrer Suche passen.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
