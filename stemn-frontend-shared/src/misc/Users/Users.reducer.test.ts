import { describe, expect, it } from 'vitest'
import reducer from './Users.reducer'

const user = { _id: 'user1', name: 'Ada Lovelace', picture: '/a.png', stub: 'ada' }

describe('Users reducer', () => {
  const prev: any = {
    user1: { loading: false, dataSize: 'sm', data: { _id: 'user1', name: 'Ada' } },
    user2: { loading: false, dataSize: 'lg', data: { _id: 'user2' } },
  }

  it('USERS/GET_USER_PENDING and _REJECTED toggle loading', () => {
    const pending = reducer(prev, { type: 'USERS/GET_USER_PENDING', meta: { userId: 'user1' } })
    expect(pending.user1).toEqual({ ...prev.user1, loading: true })
    expect(pending.user1.data).toBe(prev.user1.data)
    expect(pending.user2).toBe(prev.user2)
    const rejected = reducer(pending, { type: 'USERS/GET_USER_REJECTED', meta: { userId: 'user1' } })
    expect(rejected.user1.loading).toBe(false)
    expect(rejected.user2).toBe(prev.user2)
  })

  it('USERS/GET_USER_FULFILLED replaces the user entry', () => {
    const next = reducer(prev, {
      type: 'USERS/GET_USER_FULFILLED',
      meta: { userId: 'user1', size: 'md' },
      payload: { data: user },
    })
    expect(next.user1).toEqual({ loading: false, dataSize: 'md', data: user })
    expect(next.user2).toBe(prev.user2)
  })

  it.each([
    ['USERS/SAVE_USER_PENDING', true],
    ['USERS/SAVE_USER_REJECTED', false],
    ['USERS/SAVE_USER_FULFILLED', false],
  ])('%s sets savePending', (type, savePending) => {
    const start = { ...prev, user1: { ...prev.user1, savePending: !savePending } }
    const next = reducer(start, { type, meta: { userId: 'user1' } })
    expect(next.user1.savePending).toBe(savePending)
    expect(next.user1.data).toBe(prev.user1.data)
    expect(next.user2).toBe(prev.user2)
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'USERS/GET_USER_REJECTED', meta: { userId: 'user1' } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
