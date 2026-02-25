import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001
const globalDelay = Number(process.env.DELAY_MS ?? 0)

app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-sim-error',
    'x-sim-delay',
  ],
}))
app.use(express.json())

// --- Global delay (CI: 0) ---
app.use((_req, _res, next) => {
  if (globalDelay > 0) return setTimeout(next, globalDelay)
  next()
})

// --- Per-request simulation middleware ---
app.use((req, res, next) => {
  const err = req.header('x-sim-error')
  const dly = Number(req.header('x-sim-delay') ?? 0)

  const proceed = () => {
    if (err) return res.status(Number(err)).json({ error: `Simulated failure (${err})` })
    next()
  }

  if (dly > 0) return setTimeout(proceed, dly)
  proceed()
})

// ─── Seed data ───

const USERS = {
  'citizen@example.com': { password: 'password', user: { email: 'citizen@example.com', role: 'citizen', token: 'tok-citizen-001' } },
  'officer@example.com': { password: 'password', user: { email: 'officer@example.com', role: 'officer', token: 'tok-officer-001' } },
}

const PROGRAMS = [
  { id: 'P-1001', title: 'IT-Beratung', description: 'Individuelle Beratung fuer IT-Infrastruktur und Digitalisierung.', category: 'Beratung' },
  { id: 'P-1002', title: 'Gruendercoaching', description: 'Coaching-Programm fuer Existenzgruender und Startups.', category: 'Coaching' },
  { id: 'P-1003', title: 'Energieeffizienz', description: 'Foerderung energieeffizienter Massnahmen in Unternehmen.', category: 'Umwelt' },
  { id: 'P-1004', title: 'Weiterbildung Digital', description: 'Zuschuss fuer digitale Weiterbildungsprogramme.', category: 'Bildung' },
  { id: 'P-1005', title: 'Innovationsfoerderung', description: 'Unterstuetzung innovativer Projekte und Forschung.', category: 'Innovation' },
  { id: 'P-1006', title: 'Service-Optimierung', description: 'Beratung zur Optimierung bestehender Serviceprozesse.', category: 'Beratung' },
]

let nextAppId = 2004
const APPLICATIONS = [
  { id: 'A-2001', programId: 'P-1001', programTitle: 'IT-Beratung', applicantName: 'Maria Schmidt', applicantEmail: 'maria@example.com', status: 'submitted', createdAt: '2025-11-15T10:00:00Z', updatedAt: '2025-11-15T10:00:00Z' },
  { id: 'A-2002', programId: 'P-1003', programTitle: 'Energieeffizienz', applicantName: 'Thomas Mueller', applicantEmail: 'thomas@example.com', status: 'in_review', createdAt: '2025-11-10T08:30:00Z', updatedAt: '2025-11-12T14:00:00Z' },
  { id: 'A-2003', programId: 'P-1002', programTitle: 'Gruendercoaching', applicantName: 'Laura Weber', applicantEmail: 'laura@example.com', status: 'approved', createdAt: '2025-10-20T09:15:00Z', updatedAt: '2025-11-01T11:00:00Z' },
]

// ─── Routes ───

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body
  const entry = USERS[email]
  if (!entry || entry.password !== password) {
    return res.status(401).json({ error: 'Ungueltige Anmeldedaten' })
  }
  res.json(entry.user)
})

app.get('/programs', (req, res) => {
  const q = req.query.q
  if (q) {
    const lower = String(q).toLowerCase()
    const filtered = PROGRAMS.filter(p =>
      p.title.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower)
    )
    return res.json(filtered)
  }
  res.json(PROGRAMS)
})

app.get('/applications', (_req, res) => {
  res.json(APPLICATIONS)
})

app.get('/applications/:id', (req, res) => {
  const app = APPLICATIONS.find(a => a.id === req.params.id)
  if (!app) return res.status(404).json({ error: 'Nicht gefunden' })
  res.json(app)
})

app.post('/applications', (req, res) => {
  const { programId, applicantName, applicantEmail } = req.body
  const program = PROGRAMS.find(p => p.id === programId)
  const newApp = {
    id: `A-${nextAppId++}`,
    programId,
    programTitle: program?.title || 'Unbekannt',
    applicantName,
    applicantEmail,
    status: 'submitted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  APPLICATIONS.push(newApp)
  res.status(201).json(newApp)
})

app.patch('/applications/:id', (req, res) => {
  const app = APPLICATIONS.find(a => a.id === req.params.id)
  if (!app) return res.status(404).json({ error: 'Nicht gefunden' })

  const { status } = req.body
  app.status = status
  app.updatedAt = new Date().toISOString()
  res.json(app)
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
