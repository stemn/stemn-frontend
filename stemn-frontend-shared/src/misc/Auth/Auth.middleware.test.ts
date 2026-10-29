import { describe, expect, it, vi } from 'vitest'
import auth from './Auth.middleware'

const storeWith = (authState: any) => ({ getState: () => ({ auth: authState }), dispatch: vi.fn() })

describe('Auth middleware', () => {
  it('forwards auth actions of an authed user without the auth key', () => {
    const next = vi.fn()
    const action = { type: 'PROJECTS/SAVE_PROJECT', auth: true, payload: { name: 'Bracket' } }
    auth(storeWith({ user: { _id: 'user1' }, authToken: 'token' }) as any)(next)(action)
    expect(next).toHaveBeenCalledWith({ ...action, auth: undefined })
    expect(action.auth).toBe(true)
  })

  it('redirects to login instead when not authed', () => {
    const next = vi.fn()
    const store = storeWith({ user: {}, authToken: null })
    auth(store as any)(next)({ type: 'PROJECTS/SAVE_PROJECT', auth: true })
    expect(next).not.toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledTimes(1)
  })

  it('passes other actions through', () => {
    const next = vi.fn(() => 'result')
    const action = { type: 'OTHER' }
    expect(auth(storeWith({}) as any)(next)(action)).toBe('result')
    expect(next).toHaveBeenCalledWith(action)
  })
})
