import type { Program, Application, User } from '@/lib/types'

export const USERS: Record<string, { password: string; user: User }> = {
  'citizen@example.com': {
    password: 'password',
    user: { email: 'citizen@example.com', role: 'citizen', token: 'tok-citizen-001' },
  },
  'officer@example.com': {
    password: 'password',
    user: { email: 'officer@example.com', role: 'officer', token: 'tok-officer-001' },
  },
}

export const PROGRAMS: Program[] = [
  { id: 'P-1001', title: 'IT-Beratung', description: 'Individuelle Beratung fuer IT-Infrastruktur und Digitalisierung.', category: 'Beratung' },
  { id: 'P-1002', title: 'Gruendercoaching', description: 'Coaching-Programm fuer Existenzgruender und Startups.', category: 'Coaching' },
  { id: 'P-1003', title: 'Energieeffizienz', description: 'Foerderung energieeffizienter Massnahmen in Unternehmen.', category: 'Umwelt' },
  { id: 'P-1004', title: 'Weiterbildung Digital', description: 'Zuschuss fuer digitale Weiterbildungsprogramme.', category: 'Bildung' },
  { id: 'P-1005', title: 'Innovationsfoerderung', description: 'Unterstuetzung innovativer Projekte und Forschung.', category: 'Innovation' },
  { id: 'P-1006', title: 'Service-Optimierung', description: 'Beratung zur Optimierung bestehender Serviceprozesse.', category: 'Beratung' },
]

let nextAppId = 2004

export const APPLICATIONS: Application[] = [
  {
    id: 'A-2001',
    programId: 'P-1001',
    programTitle: 'IT-Beratung',
    applicantName: 'Maria Schmidt',
    applicantEmail: 'maria@example.com',
    status: 'submitted',
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2025-11-15T10:00:00Z',
  },
  {
    id: 'A-2002',
    programId: 'P-1003',
    programTitle: 'Energieeffizienz',
    applicantName: 'Thomas Mueller',
    applicantEmail: 'thomas@example.com',
    status: 'in_review',
    createdAt: '2025-11-10T08:30:00Z',
    updatedAt: '2025-11-12T14:00:00Z',
  },
  {
    id: 'A-2003',
    programId: 'P-1002',
    programTitle: 'Gruendercoaching',
    applicantName: 'Laura Weber',
    applicantEmail: 'laura@example.com',
    status: 'approved',
    createdAt: '2025-10-20T09:15:00Z',
    updatedAt: '2025-11-01T11:00:00Z',
  },
]

export function createApplication(data: {
  programId: string
  applicantName: string
  applicantEmail: string
}): Application {
  const program = PROGRAMS.find((p) => p.id === data.programId)
  const app: Application = {
    id: `A-${nextAppId++}`,
    programId: data.programId,
    programTitle: program?.title || 'Unbekannt',
    applicantName: data.applicantName,
    applicantEmail: data.applicantEmail,
    status: 'submitted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  APPLICATIONS.push(app)
  return app
}
