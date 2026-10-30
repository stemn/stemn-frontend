import { QueryClient } from '@tanstack/react-query'
import { applyMiddleware, legacy_createStore as createStore, type UnknownAction } from 'redux'
import { describe, expect, it, vi } from 'vitest'
import { connectLegacyBridge } from './legacyBridge'
import { createQueryMiddleware, invalidateQueries } from './invalidation'
import { legacyInvalidations } from './legacyInvalidations'
import { queryKeys } from './keys'
import { legacySync } from './meta'

type State = { auth: { authToken: string | null } }

const setup = () => {
  const queryClient = new QueryClient()
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
  const clear = vi.spyOn(queryClient, 'clear')
  const reducer = (state: State = { auth: { authToken: 'token' } }, action: UnknownAction): State =>
    action.type === 'SET_TOKEN' ? { auth: { authToken: action.payload as string | null } } : state
  const store = createStore(reducer, applyMiddleware(createQueryMiddleware(queryClient, { legacyInvalidations })))
  return { queryClient, invalidate, clear, store }
}

describe('createQueryMiddleware', () => {
  it('invalidates the keys of API/INVALIDATE_QUERIES (websocket events, the main process)', () => {
    const { invalidate, store } = setup()
    store.dispatch(invalidateQueries(queryKeys.threads.detail('t1'), queryKeys.threads.lists()))
    expect(invalidate.mock.calls.map(([filters]) => filters?.queryKey)).toEqual([
      ['threads', 'detail', 't1'],
      ['threads', 'list'],
    ])
  })

  it('invalidates the queries a legacy Redux write makes stale, but not the bridge own writes', () => {
    const { invalidate, store } = setup()
    store.dispatch({ type: 'THREADS/UPDATE_TASK_FULFILLED', meta: { cacheKey: 't1' } })
    store.dispatch({ type: 'PROJECTS/SAVE_PROJECT_FULFILLED', meta: { projectId: 'p1' } })
    store.dispatch({ type: 'PROJECTS/GET_PROJECT_FULFILLED', meta: { projectId: 'p1', fromQuery: true } })
    store.dispatch({ type: 'THREADS/UPDATE_TASK_FULFILLED', meta: { cacheKey: 't1', fromQuery: true } })
    expect(invalidate.mock.calls.map(([filters]) => filters?.queryKey)).toEqual([
      ['threads', 'detail', 't1'],
      ['threads', 'list'],
      ['projects', 'detail', 'p1'],
      ['projects', 'user'],
    ])
  })

  it('clears the cache on logout and refetches everything on login', () => {
    const { invalidate, clear, store } = setup()
    store.dispatch({ type: 'SET_TOKEN', payload: null })
    expect(clear).toHaveBeenCalledTimes(1)
    store.dispatch({ type: 'SET_TOKEN', payload: 'new-token' })
    expect(invalidate).toHaveBeenCalledWith()
    store.dispatch({ type: 'SOMETHING_ELSE' })
    expect(clear).toHaveBeenCalledTimes(1)
    expect(invalidate).toHaveBeenCalledTimes(1)
  })
})

describe('connectLegacyBridge', () => {
  it('writes new query data into the legacy slice, once per version', async () => {
    const queryClient = new QueryClient()
    const dispatch = vi.fn((action: UnknownAction) => action)
    connectLegacyBridge(queryClient, dispatch)
    const options = {
      queryKey: ['projects', 'detail', 'p1'],
      meta: {
        legacySync: legacySync<{ name: string }>((project) => ({
          type: 'PROJECTS/GET_PROJECT_FULFILLED',
          payload: { data: project },
          meta: { projectId: 'p1' },
        })),
      },
    }
    await queryClient.fetchQuery({ ...options, queryFn: () => ({ name: 'One' }) })
    // A refetch with deep-equal data keeps the reference (structural sharing): nothing to sync
    await queryClient.fetchQuery({ ...options, queryFn: () => ({ name: 'One' }), staleTime: 0 })
    await queryClient.fetchQuery({ ...options, queryFn: () => ({ name: 'Two' }), staleTime: 0 })
    await vi.waitFor(() => expect(dispatch).toHaveBeenCalledTimes(2))
    expect(dispatch.mock.calls.map(([action]) => action)).toEqual([
      {
        type: 'PROJECTS/GET_PROJECT_FULFILLED',
        payload: { data: { name: 'One' } },
        meta: { projectId: 'p1', fromQuery: true },
      },
      {
        type: 'PROJECTS/GET_PROJECT_FULFILLED',
        payload: { data: { name: 'Two' } },
        meta: { projectId: 'p1', fromQuery: true },
      },
    ])
  })

  it('ignores queries without legacySync', async () => {
    const queryClient = new QueryClient()
    const dispatch = vi.fn()
    connectLegacyBridge(queryClient, dispatch)
    await queryClient.fetchQuery({ queryKey: ['comments', 'detail', 'c1'], queryFn: () => ({ _id: 'c1' }) })
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(dispatch).not.toHaveBeenCalled()
  })
})
