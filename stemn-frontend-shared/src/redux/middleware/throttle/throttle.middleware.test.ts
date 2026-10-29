import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import throttle from './throttle.middleware'

describe('throttle middleware', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('dispatches only the last action of the period, without the throttle key', () => {
    const next = vi.fn()
    const dispatch = throttle({} as any)(next)
    const action = (name: string) => ({
      type: 'THREADS/UPDATE_TASK',
      throttle: { time: 1000, endpoint: 'THREADS/UPDATE_TASK-t1' },
      payload: { data: { name } },
    })
    const last = action('second')
    dispatch(action('first'))
    dispatch(last)
    expect(next).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1000)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next.mock.calls[0][0]).toEqual({ ...last, throttle: undefined })
    expect(last.throttle).toEqual({ time: 1000, endpoint: 'THREADS/UPDATE_TASK-t1' })
  })

  it('passes other actions through', () => {
    const next = vi.fn(() => 'result')
    const action = { type: 'OTHER' }
    expect(throttle({} as any)(next)(action)).toBe('result')
    expect(next).toHaveBeenCalledWith(action)
  })
})
