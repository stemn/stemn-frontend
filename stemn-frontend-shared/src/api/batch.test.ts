import { afterEach, describe, expect, it, vi } from 'vitest'
import { createBatcher } from './batch'
import { ApiError } from './errors'

type Item = { _id: string; error?: string }

describe('createBatcher', () => {
  afterEach(() => vi.useRealTimers())

  it('sends the ids requested within the window as one request, once per id', async () => {
    vi.useFakeTimers()
    const fetchMany = vi.fn(async (ids: string[]) => ids.map((_id) => ({ _id })))
    const { load } = createBatcher<Item>({ fetchMany })
    const results = Promise.all([load('a'), load('b'), load('a')])
    await vi.advanceTimersByTimeAsync(20)
    expect(await results).toEqual([{ _id: 'a' }, { _id: 'b' }, { _id: 'a' }])
    expect(fetchMany).toHaveBeenCalledTimes(1)
    expect(fetchMany).toHaveBeenCalledWith(['a', 'b'])
  })

  it('sends a full batch (20 ids, the API limit) at once and starts a new one', async () => {
    vi.useFakeTimers()
    const fetchMany = vi.fn(async (ids: string[]) => ids.map((_id) => ({ _id })))
    const { load } = createBatcher<Item>({ fetchMany })
    const ids = Array.from({ length: 25 }, (_, index) => `id${index}`)
    const results = Promise.all(ids.map(load))
    expect(fetchMany).toHaveBeenCalledTimes(1) // sent synchronously when the 20th id arrives
    expect(fetchMany.mock.calls[0][0]).toHaveLength(20)
    await vi.advanceTimersByTimeAsync(20)
    expect(fetchMany).toHaveBeenCalledTimes(2)
    expect(fetchMany.mock.calls[1][0]).toEqual(ids.slice(20))
    expect((await results).map((item) => item._id)).toEqual(ids)
  })

  it('rejects the ids the list route answered with an error (or left out), resolves the others', async () => {
    vi.useFakeTimers()
    const { load } = createBatcher<Item>({
      fetchMany: async () => [{ _id: 'missing', error: 'Not Found' }, { _id: 'ok' }],
    })
    const missing = load('missing').catch((error: unknown) => error)
    const absent = load('absent').catch((error: unknown) => error)
    const ok = load('ok')
    await vi.advanceTimersByTimeAsync(20)
    expect(await ok).toEqual({ _id: 'ok' })
    expect(await missing).toBeInstanceOf(ApiError)
    expect(await missing).toMatchObject({ status: 404, type: 'ENTITY_NOT_FOUND', message: 'Not Found' })
    expect(await absent).toMatchObject({ status: 404 })
  })

  it('rejects every id of the batch when the request fails', async () => {
    vi.useFakeTimers()
    const failure = new ApiError({ status: 500, message: 'Server error' })
    const { load } = createBatcher<Item>({ fetchMany: async () => Promise.reject(failure) })
    const results = Promise.allSettled([load('a'), load('b')])
    await vi.advanceTimersByTimeAsync(20)
    expect((await results).map((result) => result.status === 'rejected' && result.reason)).toEqual([failure, failure])
  })
})
