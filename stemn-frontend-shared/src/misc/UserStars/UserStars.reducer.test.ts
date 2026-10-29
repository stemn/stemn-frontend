import { describe, expect, it } from 'vitest'
import reducer from './UserStars.reducer'

describe('UserStars reducer', () => {
  const prev: any = {
    user1: { 1: { loading: false, data: ['a', 'b'] }, 2: { loading: false, data: ['c'] } },
    user2: { 1: { loading: false, data: [] } },
  }

  it('USER_STARS/GET_STARS_PENDING marks the page as loading', () => {
    const next = reducer(prev, { type: 'USER_STARS/GET_STARS_PENDING', meta: { userId: 'user1', page: 2 } })
    expect(next.user1[2]).toEqual({ loading: true, data: ['c'] })
    expect(next.user1[2].data).toBe(prev.user1[2].data)
    expect(next.user1[1]).toBe(prev.user1[1])
    expect(next.user2).toBe(prev.user2)
  })

  it('USER_STARS/GET_STARS_REJECTED clears loading, creating the page', () => {
    const next = reducer(prev, { type: 'USER_STARS/GET_STARS_REJECTED', meta: { userId: 'user3', page: 1 } })
    expect(next.user3).toEqual({ 1: { loading: false } })
    expect(Array.isArray(next.user3)).toBe(false)
    expect(next.user1).toBe(prev.user1)
  })

  it('USER_STARS/GET_STARS_FULFILLED stores the page', () => {
    const data = ['d', 'e']
    const next = reducer(prev, {
      type: 'USER_STARS/GET_STARS_FULFILLED',
      meta: { userId: 'user1', page: 3 },
      payload: { data },
    })
    expect(next.user1[3]).toEqual({ loading: false, data })
    expect(next.user1[1]).toBe(prev.user1[1])
    expect(next.user2).toBe(prev.user2)
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'USER_STARS/GET_STARS_REJECTED', meta: { userId: 'user1', page: 1 } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
