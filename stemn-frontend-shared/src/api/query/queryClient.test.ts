import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '../errors'
import { createStemnQueryClient, queryErrorAction, shouldRetry } from './queryClient'

const notFound = () =>
  new ApiError({
    status: 404,
    type: 'ENTITY_NOT_FOUND',
    message: 'Thread not found!',
    body: { error: { message: 'Thread not found!' } },
  })

describe('createStemnQueryClient', () => {
  it('reports failed queries without data and failed mutations, as ToastsError-compatible actions', async () => {
    const onError = vi.fn()
    const queryClient = createStemnQueryClient({ onError })
    queryClient.setDefaultOptions({ queries: { retry: false } })
    await queryClient
      .fetchQuery({ queryKey: ['threads', 'detail', 't1'], queryFn: () => Promise.reject(notFound()) })
      .catch(() => undefined)
    await queryClient
      .getMutationCache()
      .build(queryClient, { mutationKey: ['threads', 'update'], mutationFn: () => Promise.reject(notFound()) })
      .execute(undefined)
      .catch(() => undefined)

    expect(onError.mock.calls.map(([, context]) => context)).toEqual([
      { kind: 'query', queryKey: ['threads', 'detail', 't1'] },
      { kind: 'mutation', mutationKey: ['threads', 'update'] },
    ])
    const action = queryErrorAction(onError.mock.calls[0][0], onError.mock.calls[0][1])
    expect(action).toMatchObject({
      type: 'API/QUERY_REJECTED',
      error: true,
      payload: {
        message: 'Thread not found!',
        status: 404,
        response: { data: { error: { message: 'Thread not found!' } } },
      },
      meta: { queryKey: ['threads', 'detail', 't1'] },
    })
    expect(action.type.endsWith('_REJECTED')).toBe(true) // what ToastsError.middleware listens to
  })

  it('does not report a failing background refetch (the cached data stays on screen) or silent queries', async () => {
    const onError = vi.fn()
    const queryClient = createStemnQueryClient({ onError })
    queryClient.setDefaultOptions({ queries: { retry: false } })
    queryClient.setQueryData(['notifications', 'list'], [])
    await queryClient.refetchQueries({ queryKey: ['notifications', 'list'] }) // no queryFn yet: ignored
    await queryClient
      .fetchQuery({ queryKey: ['notifications', 'list'], queryFn: () => Promise.reject(notFound()), staleTime: 0 })
      .catch(() => undefined)
    await queryClient
      .fetchQuery({ queryKey: ['me'], queryFn: () => Promise.reject(notFound()), meta: { silent: true } })
      .catch(() => undefined)
    expect(onError).not.toHaveBeenCalled()
  })

  it('does not retry client errors', () => {
    expect(shouldRetry(0, notFound())).toBe(false)
    expect(shouldRetry(0, new ApiError({ status: 0, message: 'Network error' }))).toBe(true)
    expect(shouldRetry(1, new ApiError({ status: 503, message: 'Unavailable' }))).toBe(true)
    expect(shouldRetry(2, new ApiError({ status: 503, message: 'Unavailable' }))).toBe(false)
  })
})
