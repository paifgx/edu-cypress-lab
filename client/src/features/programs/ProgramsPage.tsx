import { useState, useEffect, useRef } from 'react'
import { apiFetch } from '@/lib/api'
import type { Program } from '@/lib/types'
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
    <div data-testid="programs-page">
      <h2>Programme</h2>

      <div className="filter-bar">
        <input
          data-testid="filter-input"
          type="text"
          placeholder="Programme durchsuchen..."
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
        />
      </div>

      {loading && (
        <div data-testid="spinner" className="loading-state">
          <div className="spinner" />
          <span>Lade Programme...</span>
        </div>
      )}

      {error && (
        <div role="alert" data-testid="error-banner" className="error-banner">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div data-testid="results" className="programs-grid">
          {filtered.map((p) => (
            <div key={p.id} data-testid="program-card" className="card program-card">
              <span className="program-category">{p.category}</span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="no-results">Keine Programme gefunden.</p>
          )}
        </div>
      )}
    </div>
  )
}
