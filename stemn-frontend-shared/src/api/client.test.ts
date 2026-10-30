import { HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { api, createApiClient, setApiTokenGetter, unwrap } from './client'
import { ApiError, isApiError, toPlainError } from './errors'
import { apiHandler, API_ORIGIN } from './testing/msw'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  setApiTokenGetter(() => undefined)
})
afterAll(() => server.close())

/** Records the requests a handler receives */
const capture = () => {
  const requests: Request[] = []
  return { requests, record: (request: Request) => requests.push(request) }
}

describe('query string serialisation (axios 0.x format, legacyParamsSerializer)', () => {
  it('sends arrays as repeated `key[]` pairs', async () => {
    const { requests, record } = capture()
    server.use(
      apiHandler('ThreadList', ({ request }) => {
        record(request)
        return HttpResponse.json([])
      }),
    )
    await unwrap(api.GET('/api/v1/threads', { params: { query: { ids: ['a', 'b'] } } }))
    expect(new URL(requests[0].url).search).toBe('?ids[]=a&ids[]=b')
  })

  it('JSON-encodes objects (criteria), drops undefined values and keeps the other scalars', async () => {
    const { requests, record } = capture()
    server.use(
      apiHandler('SearchGet', ({ request }) => {
        record(request)
        return HttpResponse.json([])
      }),
    )
    await unwrap(
      api.GET('/api/v1/search', {
        params: {
          query: {
            type: 'project',
            parentId: undefined,
            size: 1000,
            published: 'both',
            select: ['_id', 'name'],
            criteria: { private: 'all' },
          },
        },
      }),
    )
    const search = new URL(requests[0].url).search
    expect(search).toBe(
      '?type=project&size=1000&published=both&select[]=_id&select[]=name&criteria=%7B%22private%22:%22all%22%7D',
    )
    // The API (qs) reads it back as the frontend meant it
    expect(new URL(requests[0].url).searchParams.get('criteria')).toBe('{"private":"all"}')
  })

  it('encodes path parameters', async () => {
    const { requests, record } = capture()
    server.use(
      apiHandler('ThreadGet', ({ request, params }) => {
        record(request)
        return HttpResponse.json({ _id: params.threadId })
      }),
    )
    const thread = await unwrap(api.GET('/api/v1/threads/{threadId}', { params: { path: { threadId: 't 1' } } }))
    expect(new URL(requests[0].url).pathname).toBe('/api/v1/threads/t%201')
    expect(thread).toEqual({ _id: 't 1' })
  })
})

describe('auth header', () => {
  it('sends `bearer <token>` from the app auth state', async () => {
    const { requests, record } = capture()
    server.use(
      apiHandler('UserMe', ({ request }) => {
        record(request)
        return HttpResponse.json({ _id: 'me' })
      }),
    )
    let token: string | null = 'token-1'
    setApiTokenGetter(() => token)
    await unwrap(api.GET('/api/v1/me'))
    token = 'token-2' // read on every request
    await unwrap(api.GET('/api/v1/me'))
    expect(requests.map((request) => request.headers.get('Authorization'))).toEqual([
      'bearer token-1',
      'bearer token-2',
    ])
  })

  it('sends no header when logged out, and keeps an explicit one', async () => {
    const { requests, record } = capture()
    server.use(
      apiHandler('UserMe', ({ request }) => {
        record(request)
        return HttpResponse.json({ _id: 'me' })
      }),
    )
    await unwrap(api.GET('/api/v1/me'))
    setApiTokenGetter(() => 'token')
    await unwrap(api.GET('/api/v1/me', { headers: { Authorization: 'bearer other' } }))
    expect(requests[0].headers.has('Authorization')).toBe(false)
    expect(requests[1].headers.get('Authorization')).toBe('bearer other')
  })

  it('works with a separately created client', async () => {
    const { requests, record } = capture()
    server.use(
      apiHandler('UserMe', ({ request }) => {
        record(request)
        return HttpResponse.json({ _id: 'me' })
      }),
    )
    const client = createApiClient({ baseUrl: API_ORIGIN, getToken: () => 'own' })
    await unwrap(client.GET('/api/v1/me'))
    expect(requests[0].headers.get('Authorization')).toBe('bearer own')
  })
})

describe('responses and error normalisation', () => {
  it('resolves an empty 200 body (no content-length) with undefined', async () => {
    server.use(
      apiHandler(
        'NotificationMarkRead',
        () => new HttpResponse(null, { status: 200, headers: { 'Content-Type': 'application/json' } }),
      ),
    )
    await expect(
      unwrap(api.PUT('/api/v1/notifications/{notificationId}', { params: { path: { notificationId: 'n1' } } })),
    ).resolves.toBeUndefined()
  })

  it('turns a StemnError response into an ApiError with the axios-like response the app reads', async () => {
    const body = {
      error: { code: 404, type: 'ENTITY_NOT_FOUND', message: 'Thread not found!', data: { entityId: 't1' } },
    }
    server.use(apiHandler('ThreadGet', () => HttpResponse.json(body, { status: 404 })))
    const error = await unwrap(api.GET('/api/v1/threads/{threadId}', { params: { path: { threadId: 't1' } } })).catch(
      (caught: unknown) => caught,
    )
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      name: 'ApiError',
      isApiError: true,
      status: 404,
      code: 404,
      type: 'ENTITY_NOT_FOUND',
      message: 'Thread not found!',
      data: { entityId: 't1' },
      // ToastsError.middleware reads payload.response.data.error
      response: { status: 404, data: body },
    })
    expect((error as ApiError).url).toBe(`${API_ORIGIN}/api/v1/threads/t1`)
  })

  it.each([
    ['a string error', { error: 'Not allowed' }, 'Not allowed', undefined],
    ['a message', { message: 'Something else' }, 'Something else', undefined],
    ['a non-JSON body', 'Bad gateway', 'Bad gateway', undefined],
    ['an empty body', '', 'Request failed with status code 502', undefined],
  ])('normalises %s', async (_label, body, message, type) => {
    server.use(
      apiHandler('UserMe', () =>
        typeof body === 'string' ? new HttpResponse(body, { status: 502 }) : HttpResponse.json(body, { status: 502 }),
      ),
    )
    const error = await unwrap(api.GET('/api/v1/me')).catch((caught: unknown) => caught)
    expect(isApiError(error)).toBe(true)
    expect(error).toMatchObject({ status: 502, message, type })
  })

  it('turns a network failure into an ApiError with status 0', async () => {
    server.use(apiHandler('UserMe', () => HttpResponse.error()))
    const error = await unwrap(api.GET('/api/v1/me')).catch((caught: unknown) => caught)
    expect(error).toMatchObject({ isApiError: true, status: 0, type: 'NETWORK_ERROR', response: undefined })
    expect((error as ApiError).message).toMatch(/^Network error/)
  })

  it('keeps aborts as AbortErrors (query cancellation)', async () => {
    server.use(apiHandler('UserMe', () => new Promise(() => undefined)))
    const controller = new AbortController()
    const request = unwrap(api.GET('/api/v1/me', { signal: controller.signal }))
    controller.abort()
    await expect(request).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('toPlainError keeps what the toasts read and is serialisable', () => {
    const error = new ApiError({
      status: 480,
      type: 'VALIDATION_FAILED',
      message: 'Invalid',
      body: { error: { message: 'Invalid' } },
    })
    const plain = toPlainError(error)
    expect(plain).toMatchObject({
      message: 'Invalid',
      status: 480,
      response: { status: 480, data: { error: { message: 'Invalid' } } },
    })
    expect(JSON.parse(JSON.stringify(plain))).toEqual(plain)
    expect(toPlainError(new Error('boom'))).toEqual({ name: 'Error', message: 'boom' })
  })
})
