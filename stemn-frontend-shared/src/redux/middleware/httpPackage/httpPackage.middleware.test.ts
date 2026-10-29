import http from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import httpPackage from './httpPackage.middleware'

vi.mock('axios', () => ({ default: vi.fn() }))

const getUser = (userId: string) => ({
  type: 'USERS/GET_USER',
  httpPackage: { url: '/api/v1/users', method: 'GET', staticParams: { select: ['name'] }, params: { ids: userId } },
  meta: { userId, size: 'sm' },
})

describe('httpPackage middleware', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('packages requests and dispatches pending and fulfilled actions per packaged action', async () => {
    const response = { data: [{ _id: 'user1' }, { _id: 'user2' }], request: {} }
    vi.mocked(http).mockResolvedValue(response)
    const dispatch = vi.fn()
    const middleware = httpPackage({ dispatch } as any)(vi.fn())

    const first = getUser('user1')
    middleware(first)
    middleware(getUser('user2'))
    expect(dispatch.mock.calls.map(([action]) => action)).toEqual([
      { ...first, httpPackage: undefined, type: 'USERS/GET_USER_PENDING', payload: {} },
      { ...getUser('user2'), httpPackage: undefined, type: 'USERS/GET_USER_PENDING', payload: {} },
    ])
    expect(first.httpPackage).toBeDefined()

    await vi.advanceTimersByTimeAsync(20)
    expect(http).toHaveBeenCalledWith({
      url: '/api/v1/users',
      method: 'GET',
      params: { select: ['name'], ids: ['user1', 'user2'] },
    })
    const fulfilled = dispatch.mock.calls.slice(2).map(([action]) => action)
    expect(fulfilled).toEqual([
      {
        ...first,
        httpPackage: undefined,
        type: 'USERS/GET_USER_FULFILLED',
        payload: { data: { _id: 'user1' }, request: {} },
      },
      {
        ...getUser('user2'),
        httpPackage: undefined,
        type: 'USERS/GET_USER_FULFILLED',
        payload: { data: { _id: 'user2' }, request: {} },
      },
    ])
  })

  it('passes other actions through', () => {
    const next = vi.fn(() => 'result')
    const action = { type: 'OTHER' }
    expect(httpPackage({ dispatch: vi.fn() } as any)(next)(action)).toBe('result')
  })
})
