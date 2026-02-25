const BASE_URL = import.meta.env.VITE_API_URL || ''

function getSimHeaders(): Record<string, string> {
  const params = new URLSearchParams(window.location.search)
  const headers: Record<string, string> = {}
  const err = params.get('__error')
  const dly = params.get('__delay')
  if (err) headers['x-sim-error'] = err
  if (dly) headers['x-sim-delay'] = dly
  return headers
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('auth_token')
  const simHeaders = getSimHeaders()

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...simHeaders,
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new ApiError(res.status, body.error || res.statusText)
  }

  return res.json()
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
