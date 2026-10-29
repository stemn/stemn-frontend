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
  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(http).mockReset()
  })
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

  it('returns the same promise for every action of a package and resolves it once', async () => {
    vi.mocked(http).mockResolvedValue({ data: [{ _id: 'user1' }, { _id: 'user2' }], request: {} })
    const middleware = httpPackage({ dispatch: vi.fn() } as any)(vi.fn())
    const first = middleware(getUser('user1'))
    const second = middleware(getUser('user2'))
    expect(second).toBe(first)
    await vi.advanceTimersByTimeAsync(20)
    await expect(first).resolves.toBeDefined()
  })

  it('rejects every action of a failed package and its promise once (no TypeError)', async () => {
    const error = Object.assign(new Error('Request failed with status code 480'), { isAxiosError: true })
    vi.mocked(http).mockRejectedValue(error)
    const dispatch = vi.fn()
    const middleware = httpPackage({ dispatch } as any)(vi.fn())
    const promise = middleware(getUser('user1'))
    middleware(getUser('user2'))
    const settled = expect(promise).rejects.toBe(error)
    await vi.advanceTimersByTimeAsync(20)
    await settled
    expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
      'USERS/GET_USER_PENDING',
      'USERS/GET_USER_PENDING',
      'USERS/GET_USER_REJECTED',
      'USERS/GET_USER_REJECTED',
    ])
  })

  it('sends a package as soon as it holds 20 items (the API rejects more than 20 ids[])', async () => {
    vi.mocked(http).mockResolvedValue({ data: [], request: {} })
    const middleware = httpPackage({ dispatch: vi.fn() } as any)(vi.fn())
    const ids = Array.from({ length: 45 }, (_, index) => `user${index}`)
    ids.forEach((id) => middleware(getUser(id)))
    await vi.advanceTimersByTimeAsync(20)
    const sentIds = vi.mocked(http).mock.calls.map(([config]: any) => config.params.ids)
    expect(sentIds.map((batch: string[]) => batch.length)).toEqual([20, 20, 5])
    expect(sentIds.flat()).toEqual(ids)
  })

  it('passes other actions through', () => {
    const next = vi.fn(() => 'result')
    const action = { type: 'OTHER' }
    expect(httpPackage({ dispatch: vi.fn() } as any)(next)(action)).toBe('result')
  })
})
