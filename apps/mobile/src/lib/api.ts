const API_URL = process.env.EXPO_PUBLIC_API_URL

export type Arrow = {
  id: string
  number: number
  score: string | null
  roundId: string
}

export type Round = {
  id: string
  number: number
  competitionId: string
  arrows: Arrow[]
}

export type Competition = {
  id: string
  name: string | null
  date: string
  userId: string
  createdAt: string
  rounds: Round[]
}

export type CompetitionSummary = {
  id: string
  name: string | null
  date: string
}

async function request<T>(
  path: string,
  options: { method?: string; token?: string; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.error ?? `Request failed with status ${res.status}`)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json()
}

export function register(name: string, email: string, password: string) {
  return request<{ token: string }>('/auth/register', {
    method: 'POST',
    body: { name, email, password },
  })
}

export function login(email: string, password: string) {
  return request<{ token: string }>('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export function listCompetitions(token: string) {
  return request<CompetitionSummary[]>('/competitions', { token })
}

export function createCompetition(token: string, name?: string) {
  return request<Competition>('/competitions', {
    method: 'POST',
    token,
    body: { name },
  })
}

export function getCompetition(token: string, id: string) {
  return request<Competition>(`/competitions/${id}`, { token })
}

export function updateArrowScore(
  token: string,
  competitionId: string,
  roundNumber: number,
  arrowNumber: number,
  score: string
) {
  return request<Arrow>(
    `/competitions/${competitionId}/rounds/${roundNumber}/arrows/${arrowNumber}`,
    { method: 'PATCH', token, body: { score } }
  )
}

export function deleteCompetition(token: string, id: string) {
  return request<void>(`/competitions/${id}`, { method: 'DELETE', token })
}
