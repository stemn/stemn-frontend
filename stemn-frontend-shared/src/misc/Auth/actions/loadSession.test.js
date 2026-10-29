import { afterEach, describe, expect, it, vi } from 'vitest'
import { waitForToken } from './loadSession'

describe('waitForToken', () => {
  afterEach(() => vi.useRealTimers())

  it('resolves immediately when the token is already in the store', async () => {
    const getState = vi.fn(() => ({ auth: { authToken: 'token' } }))
    await waitForToken(getState)
    expect(getState).toHaveBeenCalledTimes(1)
  })

  it('waits until the token arrives (desktop renderer replica)', async () => {
    vi.useFakeTimers()
    let token = ''
    const getState = () => ({ auth: { authToken: token } })
    let resolved = false
    waitForToken(getState).then(() => {
      resolved = true
    })
    await vi.advanceTimersByTimeAsync(50)
    expect(resolved).toBe(false)
    token = 'token'
    await vi.advanceTimersByTimeAsync(10)
    expect(resolved).toBe(true)
  })

  it('gives up after the timeout', async () => {
    vi.useFakeTimers()
    let resolved = false
    waitForToken(() => ({ auth: { authToken: '' } }), { timeoutMs: 100 }).then(() => {
      resolved = true
    })
    await vi.advanceTimersByTimeAsync(110)
    expect(resolved).toBe(true)
  })
})
