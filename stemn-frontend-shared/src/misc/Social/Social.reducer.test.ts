import { describe, expect, it } from 'vitest'
import reducer from './Social.reducer'

describe('Social reducer', () => {
  const prev: any = {
    like: { project1: { status: false, parentId: 'project1' } },
    follow: { user1: { status: true } },
    clone: {},
  }

  it.each([
    ['SOCIAL/ADD_PENDING', true],
    ['SOCIAL/ADD_REJECTED', false],
    ['SOCIAL/REMOVE_PENDING', false],
    ['SOCIAL/REMOVE_REJECTED', true],
  ])('%s sets the status', (type, status) => {
    const start = { ...prev, like: { project1: { ...prev.like.project1, status: !status } } }
    const next = reducer(start, { type, meta: { type: 'like', entityId: 'project1' } })
    expect(next.like.project1).toEqual({ status, parentId: 'project1' })
    expect(next.follow).toBe(prev.follow)
    expect(next.clone).toBe(prev.clone)
  })

  it('creates the entity entry when missing', () => {
    const next = reducer(prev, { type: 'SOCIAL/ADD_PENDING', meta: { type: 'follow', entityId: 'user2' } })
    expect(next.follow).toEqual({ user1: { status: true }, user2: { status: true } })
    expect(next.follow.user1).toBe(prev.follow.user1)
    expect(next.like).toBe(prev.like)
  })

  it('SOCIAL/GET_STATUS_FULFILLED stores the status', () => {
    const next = reducer(prev, {
      type: 'SOCIAL/GET_STATUS_FULFILLED',
      meta: { type: 'like', entityId: 'project2' },
      payload: { data: { status: true, parentId: 'project2', childId: 'user1' } },
    })
    expect(next.like.project2).toEqual({ status: true, parentId: 'project2' })
    expect(next.like.project1).toBe(prev.like.project1)
    expect(next.follow).toBe(prev.follow)
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'SOCIAL/REMOVE_REJECTED', meta: { type: 'follow', entityId: 'user1' } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
