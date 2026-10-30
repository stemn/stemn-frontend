/**
 * Backend fixture: the website e2e tests run against a real Stemn backend
 * (stemn-backend `local/start.sh` + `local/seed.sh`), by default the local one:
 *
 *   API        E2E_API_URL        http://localhost:3000
 *   websocket  E2E_WEBSOCKET_URL  http://localhost:8000
 *
 * The seed data (8 demo users, password `password123`, 14 projects, threads, files...) is
 * looked up through the UI or the API by name, never by id, so the tests work on any
 * freshly seeded database.
 */
export const API_URL = process.env.E2E_API_URL || 'http://localhost:3000'
export const WEBSOCKET_URL = process.env.E2E_WEBSOCKET_URL || 'http://localhost:8000'

export const SEED_PASSWORD = 'password123'
export const seedUsers = {
  ada: { email: 'ada.lovelace@stemn.local', name: 'Ada Lovelace' },
  priya: { email: 'priya.raman@stemn.local', name: 'Priya Raman' },
} as const

export const seedData = {
  project: 'CubeSat Deployable Solar Array',
  // an open thread (the thread list shows open threads)
  thread: 'Burn wire release takes 9 s at -20 C',
  files: {
    md: 'README.md',
    pdf: 'deployment-analysis.pdf',
    pipeline: 'deploy-check.pipeline',
    svg: 'array-layout.svg',
  },
} as const

const json = async (response: Response) => {
  const text = await response.text()
  if (!response.ok) throw new Error(`${response.status} ${response.url}: ${text.slice(0, 200)}`)
  return text ? JSON.parse(text) : undefined
}

type RequestOptions = { token?: string; body?: unknown; raw?: Uint8Array; query?: Record<string, string> }

const request = (method: string, path: string, { token, body, raw, query }: RequestOptions = {}) => {
  const headers: Record<string, string> = token ? { Authorization: `bearer ${token}` } : {}
  if (raw) headers['Content-Type'] = 'application/octet-stream'
  else if (body !== undefined) headers['Content-Type'] = 'application/json'
  const search = query ? `?${new URLSearchParams(query)}` : ''
  return fetch(`${API_URL}${path}${search}`, {
    method,
    headers,
    body: raw ? new Blob([raw as Uint8Array<ArrayBuffer>]) : body === undefined ? undefined : JSON.stringify(body),
  }).then(json)
}

export const api = {
  get: (path: string, token?: string) => request('GET', path, { token }),
  post: (path: string, body: unknown, token?: string) => request('POST', path, { body, token }),
  request,
}

export const login = async (email: string, password = SEED_PASSWORD): Promise<string> =>
  (await api.post('/api/v1/auth/login', { email, password })).token

/** A unique, not yet registered account (the tests never reuse one) */
export const newAccount = (label = 'e2e') => {
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
  return {
    firstname: 'E2E',
    lastname: `${label} ${id}`,
    email: `${label}-${id}@e2e.stemn.local`,
    password: 'correct-horse-battery',
  }
}

/** Registers an account through the API, returns its token */
export const registerAccount = async (account = newAccount()) => {
  const { token } = await api.post('/api/v1/auth/register', account)
  return { ...account, token: token as string }
}

/** Waits until the API and the websocket server answer and the seed data is present */
export const waitForBackend = async (timeoutMs = 120_000) => {
  const deadline = Date.now() + timeoutMs
  let lastError: unknown
  while (Date.now() < deadline) {
    try {
      await api.get('/api/v1/version')
      const primus = await fetch(`${WEBSOCKET_URL}/primus/primus.js`)
      if (!primus.ok) throw new Error(`websocket server: ${primus.status}`)
      await login(seedUsers.ada.email)
      return
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
  throw new Error(
    `The Stemn backend is not ready at ${API_URL} / ${WEBSOCKET_URL} (start it with stemn-backend local/start.sh ` +
      `and seed it with local/seed.sh): ${String(lastError)}`,
  )
}

/** 2x2 PNG */
export const PNG_FIXTURE = Uint8Array.from(
  atob('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP4z8DAwMDAxMDAwMDAAAANHQEDasKb6QAAAABJRU5ErkJggg=='),
  (c) => c.charCodeAt(0),
)

/**
 * A fresh account with a public project on the built-in `stemn` storage provider and the
 * given files uploaded (the same API calls as the backend seeder), for tests that need data
 * the seed does not have. Returns the project id and the account.
 */
export const createProjectWithFiles = async (files: Record<string, Uint8Array>) => {
  const account = await registerAccount(newAccount('files'))
  const { token } = account
  await request('POST', '/api/v1/auth/stemn', { token, body: { code: 'e2e', redirectUri: API_URL } })
  const project = await request('POST', '/api/v1/projects', {
    token,
    body: { name: `E2E files ${account.lastname}`, blurb: 'Created by the website e2e tests', private: false },
  })
  await request('PUT', `/api/v1/sync/link/${project._id}`, { token, query: { provider: 'stemn', fileId: '' } })
  const linked = await request('GET', `/api/v1/projects/${project._id}`, { token })
  for (const [name, content] of Object.entries(files)) {
    await request('POST', `/api/v1/sync/upload/${project._id}`, {
      token,
      raw: content,
      query: { name, parentId: linked.remote.root._id },
    })
  }
  return { projectId: project._id as string, account }
}

type Thread = {
  _id: string
  name: string
  board: string
  group: string
  owner: unknown
  project: unknown
  users: unknown[]
}
type Board = { _id: string; groups: { _id: string; name: string }[] }

/** Marks the account's onboarding as done, so logging in goes to the dashboard */
export const skipOnboarding = async (token: string) => {
  const settings = await request('GET', '/api/v1/settings', { token })
  await request('PUT', `/api/v1/settings/${settings._id}`, {
    token,
    body: { ...settings, messages: { ...settings.messages, onboarding: false } },
  })
}

/** A fresh account (onboarded) with an empty public project (the backend gives it a board with three groups) */
export const createThreadsProject = async (label = 'threads') => {
  const account = await registerAccount(newAccount(label))
  await skipOnboarding(account.token)
  const project = await request('POST', '/api/v1/projects', {
    token: account.token,
    body: { name: `E2E threads ${account.lastname}`, blurb: 'Created by the website e2e tests', private: false },
  })
  const [board] = (await request('GET', `/api/v1/projects/${project._id}/boards`, { token: account.token })) as Board[]
  return { account, projectId: project._id as string, projectName: project.name as string, board }
}

const ids = (values: unknown[]) =>
  values.map((value) => (value && typeof value === 'object' ? (value as { _id: string })._id : value))

/** The thread routes the website migrated to the generated client, called as another user would */
export const threadsApi = {
  create: (token: string, projectId: string, board: Board, name: string): Promise<Thread> =>
    request('POST', `/api/v1/projects/${projectId}/threads`, {
      token,
      body: { name, board: board._id, group: board.groups[0]._id },
    }),
  /** PUT replaces the thread: send the whole thread with its references as ids */
  update: async (token: string, threadId: string, changes: Record<string, unknown>): Promise<Thread> => {
    const thread = (await request('GET', `/api/v1/threads/${threadId}`, { token })) as Thread
    return request('PUT', `/api/v1/threads/${threadId}`, {
      token,
      body: {
        ...thread,
        owner: ids([thread.owner])[0],
        project: ids([thread.project])[0],
        users: ids(thread.users),
        ...changes,
      },
    })
  },
  comment: (token: string, threadId: string, body: string): Promise<{ _id: string }> =>
    request('POST', `/api/v1/threads/${threadId}/comments`, { token, body: { thread: threadId, body } }),
  /** Like the website: the thread id is sent so the API sends THREAD/COMMENT_UPDATED to the thread room */
  editComment: (token: string, threadId: string, commentId: string, body: string) =>
    request('PUT', `/api/v1/comments/${commentId}`, { token, body: { _id: commentId, body, thread: threadId } }),
}
