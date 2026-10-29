import { describe, expect, it, vi } from 'vitest'
import transformHttp from './httpTransform.middleware'

vi.mock('axios', () => ({ default: vi.fn(() => Promise.resolve({ data: { _id: 'user1' } })) }))

describe('httpTransform middleware', () => {
  it('replaces the payload of http actions with the request promise', async () => {
    const next = vi.fn((action) => action)
    const action = {
      type: 'USERS/SAVE_USER',
      http: true,
      payload: { method: 'PUT', url: '/api/v1/users/user1', data: { name: 'Ada' } },
      meta: { userId: 'user1' },
    }
    const result = transformHttp({} as any)(next)(action)
    expect(result).not.toBe(action)
    expect(result.type).toBe('USERS/SAVE_USER')
    expect(result.meta).toBe(action.meta)
    await expect(result.payload).resolves.toEqual({ data: { _id: 'user1' } })
    expect(action.payload.url).toBe('/api/v1/users/user1')
  })

  it('passes other actions through', () => {
    const next = vi.fn((action) => action)
    const action = { type: 'OTHER', payload: { x: 1 } }
    expect(transformHttp({} as any)(next)(action)).toBe(action)
  })
})
