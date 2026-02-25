import { http, HttpResponse, delay } from 'msw'
import { USERS, PROGRAMS, APPLICATIONS, createApplication } from './data'

function simDelay(request: Request): Promise<void> {
  const dly = request.headers.get('x-sim-delay')
  if (dly) return delay(Number(dly))
  return delay(80)
}

function simError(request: Request) {
  const err = request.headers.get('x-sim-error')
  if (err) {
    return HttpResponse.json(
      { error: `Simulated failure (${err})` },
      { status: Number(err) },
    )
  }
  return null
}

export const handlers = [
  // --- Auth ---
  http.post('/auth/login', async ({ request }) => {
    await simDelay(request)
    const errResp = simError(request)
    if (errResp) return errResp

    const body = (await request.json()) as { email: string; password: string }
    const entry = USERS[body.email]

    if (!entry || entry.password !== body.password) {
      return HttpResponse.json(
        { error: 'Ungueltige Anmeldedaten' },
        { status: 401 },
      )
    }

    return HttpResponse.json(entry.user)
  }),

  // --- Programs ---
  http.get('/programs', async ({ request }) => {
    await simDelay(request)
    const errResp = simError(request)
    if (errResp) return errResp

    const url = new URL(request.url)
    const q = url.searchParams.get('q')

    if (q) {
      const lower = q.toLowerCase()
      const filtered = PROGRAMS.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower),
      )
      return HttpResponse.json(filtered)
    }

    return HttpResponse.json(PROGRAMS)
  }),

  // --- Applications ---
  http.get('/applications', async ({ request }) => {
    await simDelay(request)
    const errResp = simError(request)
    if (errResp) return errResp

    return HttpResponse.json(APPLICATIONS)
  }),

  http.get('/applications/:id', async ({ request, params }) => {
    await simDelay(request)
    const errResp = simError(request)
    if (errResp) return errResp

    const app = APPLICATIONS.find((a) => a.id === params.id)
    if (!app) {
      return HttpResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
    }

    return HttpResponse.json(app)
  }),

  http.post('/applications', async ({ request }) => {
    await simDelay(request)
    const errResp = simError(request)
    if (errResp) return errResp

    const body = (await request.json()) as {
      programId: string
      applicantName: string
      applicantEmail: string
    }

    const app = createApplication(body)
    return HttpResponse.json(app, { status: 201 })
  }),

  http.patch('/applications/:id', async ({ request, params }) => {
    await simDelay(request)
    const errResp = simError(request)
    if (errResp) return errResp

    const app = APPLICATIONS.find((a) => a.id === params.id)
    if (!app) {
      return HttpResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
    }

    const body = (await request.json()) as { status: string }
    app.status = body.status as Application['status']
    app.updatedAt = new Date().toISOString()

    return HttpResponse.json(app)
  }),
]

type Application = import('@/lib/types').Application
