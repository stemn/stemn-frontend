import { describe, expect, it } from 'vitest'
import reducer from './Comments.reducer'

const reaction = (type: string, userId: string) => ({ type, owner: { _id: userId, name: userId } })
const comment = (id: string) => ({
  _id: id,
  body: `Comment ${id}`,
  thread: 'thread1',
  reactions: [reaction('like', 'user1')],
})

describe('Comments reducer', () => {
  const prev: any = {
    data: {
      comment1: { loading: false, data: comment('comment1') },
      comment2: { loading: false, data: comment('comment2') },
    },
    threads: { thread1: { newComment: { body: 'Draft', savePending: false } } },
  }

  it('COMMENTS/GET_COMMENT_PENDING and _REJECTED toggle loading', () => {
    const pending = reducer(prev, { type: 'COMMENTS/GET_COMMENT_PENDING', meta: { commentId: 'comment1' } })
    expect(pending.data.comment1).toEqual({ ...prev.data.comment1, loading: true })
    expect(pending.data.comment1.data).toBe(prev.data.comment1.data)
    expect(pending.data.comment2).toBe(prev.data.comment2)
    expect(pending.threads).toBe(prev.threads)
    const rejected = reducer(pending, { type: 'COMMENTS/GET_COMMENT_REJECTED', meta: { commentId: 'comment1' } })
    expect(rejected.data.comment1.loading).toBe(false)
  })

  it('COMMENTS/GET_COMMENT_FULFILLED picks the comment out of the packaged response', () => {
    const data = [comment('comment9'), comment('comment3')]
    const next = reducer(prev, {
      type: 'COMMENTS/GET_COMMENT_FULFILLED',
      meta: { commentId: 'comment3' },
      payload: { data },
    })
    expect(next.data.comment3).toEqual({ loading: false, data: data[1] })
    expect(next.data.comment1).toBe(prev.data.comment1)
    expect(next.threads).toBe(prev.threads)
  })

  it('COMMENTS/START_EDIT and COMMENTS/FINISH_EDIT toggle editActive', () => {
    const started = reducer(prev, { type: 'COMMENTS/START_EDIT', payload: { commentId: 'comment1' } })
    expect(started.data.comment1.editActive).toBe(true)
    expect(started.data.comment2).toBe(prev.data.comment2)
    const finished = reducer(started, { type: 'COMMENTS/FINISH_EDIT', payload: { commentId: 'comment1' } })
    expect(finished.data.comment1.editActive).toBe(false)
  })

  it('COMMENTS/NEW_COMMENT_PENDING and _REJECTED toggle savePending of the new comment', () => {
    const pending = reducer(prev, { type: 'COMMENTS/NEW_COMMENT_PENDING', meta: { threadId: 'thread1' } })
    expect(pending.threads.thread1.newComment).toEqual({ body: 'Draft', savePending: true })
    expect(pending.data).toBe(prev.data)
    const rejected = reducer(pending, { type: 'COMMENTS/NEW_COMMENT_REJECTED', meta: { threadId: 'thread2' } })
    expect(rejected.threads.thread2).toEqual({ newComment: { savePending: false } })
    expect(rejected.threads.thread1).toBe(pending.threads.thread1)
  })

  it('COMMENTS/NEW_COMMENT_FULFILLED resets the new comment and stores the comment', () => {
    const data = comment('comment4')
    const next = reducer(prev, {
      type: 'COMMENTS/NEW_COMMENT_FULFILLED',
      meta: { threadId: 'thread1' },
      payload: { data },
    })
    expect(next.threads.thread1.newComment).toEqual({})
    expect(next.data.comment4).toEqual({ data })
    expect(next.data.comment1).toBe(prev.data.comment1)
  })

  it.each([
    ['COMMENTS/DELETE_PENDING', 'deletePending', true],
    ['COMMENTS/DELETE_REJECTED', 'deletePending', false],
    ['COMMENTS/UPDATE_PENDING', 'savePending', true],
    ['COMMENTS/UPDATE_REJECTED', 'savePending', false],
  ])('%s sets %s', (type, key, value) => {
    const next = reducer(prev, { type, meta: { commentId: 'comment1' } })
    expect(next.data.comment1).toEqual({ ...prev.data.comment1, [key]: value })
    expect(next.data.comment1.data).toBe(prev.data.comment1.data)
    expect(next.data.comment2).toBe(prev.data.comment2)
  })

  it('COMMENTS/DELETE_FULFILLED clears the comment entry (key kept, value undefined)', () => {
    const next = reducer(prev, { type: 'COMMENTS/DELETE_FULFILLED', meta: { commentId: 'comment1' } })
    expect(next.data).toHaveProperty('comment1', undefined)
    expect(next.data.comment2).toBe(prev.data.comment2)
    expect(reducer(prev, { type: 'COMMENTS/DELETE_FULFILLED', meta: { commentId: 'missing' } })).toBe(prev)
  })

  it('COMMENTS/UPDATE_FULFILLED replaces the entry with the saved comment', () => {
    const data = { ...comment('comment2'), body: 'Edited' }
    const next = reducer(prev, {
      type: 'COMMENTS/UPDATE_FULFILLED',
      meta: { commentId: 'comment2' },
      payload: { data },
    })
    expect(next.data.comment2).toEqual({ data, savePending: false })
    expect(next.data.comment1).toBe(prev.data.comment1)
  })

  it('COMMENTS/NEW_REACTION_FULFILLED adds the reaction', () => {
    const newReaction = reaction('thumbsUp', 'user2')
    const next = reducer(prev, {
      type: 'COMMENTS/NEW_REACTION_FULFILLED',
      meta: { commentId: 'comment1' },
      payload: { data: newReaction },
    })
    expect(next.data.comment1.data.reactions).toEqual([...prev.data.comment1.data.reactions, newReaction])
    expect(prev.data.comment1.data.reactions).toHaveLength(1)
    expect(next.data.comment2).toBe(prev.data.comment2)
  })

  it('COMMENTS/DELETE_REACTION_FULFILLED removes the reaction of the user', () => {
    const next = reducer(prev, {
      type: 'COMMENTS/DELETE_REACTION_FULFILLED',
      meta: { commentId: 'comment1', reactionType: 'like', userId: 'user1' },
    })
    expect(next.data.comment1.data.reactions).toEqual([])
    expect(next.data.comment1.data.body).toBe('Comment comment1')
    expect(next.data.comment2).toBe(prev.data.comment2)
  })

  it('COMMENTS/DELETE_REACTION_FULFILLED returns the same state when the reaction is not found', () => {
    const action = {
      type: 'COMMENTS/DELETE_REACTION_FULFILLED',
      meta: { commentId: 'comment1', reactionType: 'like', userId: 'user2' },
    }
    expect(reducer(prev, action)).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
