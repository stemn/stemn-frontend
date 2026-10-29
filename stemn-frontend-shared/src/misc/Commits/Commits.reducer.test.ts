import { describe, expect, it } from 'vitest'
import reducer from './Commits.reducer'

const commit = { _id: 'commit1', summary: 'Update bracket', revisions: [{ _id: 'rev1' }] }

describe('Commits reducer', () => {
  const prev = {
    commit1: { loading: false, data: { _id: 'commit1', summary: 'Old' } },
    commit2: { loading: false, data: { _id: 'commit2' } },
  }

  it('COMMITS/GET_COMMIT_PENDING marks the commit as loading', () => {
    const next = reducer(prev, { type: 'COMMITS/GET_COMMIT_PENDING', meta: { cacheKey: 'commit1' } })
    expect(next.commit1).toEqual({ loading: true, data: prev.commit1.data })
    expect(next.commit1.data).toBe(prev.commit1.data)
    expect(next.commit2).toBe(prev.commit2)
  })

  it('COMMITS/GET_COMMIT_REJECTED clears loading, creating the entry', () => {
    const next = reducer(prev, { type: 'COMMITS/GET_COMMIT_REJECTED', meta: { cacheKey: 'commit3' } })
    expect(next.commit3).toEqual({ loading: false })
    expect(next.commit1).toBe(prev.commit1)
  })

  it('COMMITS/GET_COMMIT_FULFILLED stores the commit', () => {
    const loading = { ...prev, commit1: { loading: true } }
    const next = reducer(loading, {
      type: 'COMMITS/GET_COMMIT_FULFILLED',
      meta: { cacheKey: 'commit1' },
      payload: { data: commit },
    })
    expect(next.commit1).toEqual({ loading: false, data: commit })
    expect(next.commit1.data).toBe(commit)
    expect(next.commit2).toBe(prev.commit2)
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'COMMITS/GET_COMMIT_REJECTED', meta: { cacheKey: 'commit1' } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
