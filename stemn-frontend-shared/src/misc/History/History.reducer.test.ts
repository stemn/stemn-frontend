import { describe, expect, it } from 'vitest'
import reducer from './History.reducer'

const history = [{ _id: 'event1', event: 'commit' }]

describe('History reducer', () => {
  const prev = {
    'file1-history': { loading: false, data: [{ _id: 'event0' }] },
    'file2-history': { loading: false, data: [] },
  }

  it('HISTORY/GET_HISTORY_PENDING marks the history as loading', () => {
    const next = reducer(prev, { type: 'HISTORY/GET_HISTORY_PENDING', meta: { cacheKey: 'file1-history' } })
    expect(next['file1-history']).toEqual({ loading: true, data: [{ _id: 'event0' }] })
    expect(next['file1-history'].data).toBe(prev['file1-history'].data)
    expect(next['file2-history']).toBe(prev['file2-history'])
  })

  it('HISTORY/GET_HISTORY_REJECTED clears loading', () => {
    const loading = { ...prev, 'file1-history': { loading: true } }
    const next = reducer(loading, { type: 'HISTORY/GET_HISTORY_REJECTED', meta: { cacheKey: 'file1-history' } })
    expect(next['file1-history']).toEqual({ loading: false })
    expect(next['file2-history']).toBe(prev['file2-history'])
  })

  it('HISTORY/GET_HISTORY_FULFILLED replaces the entry', () => {
    const next = reducer(prev, {
      type: 'HISTORY/GET_HISTORY_FULFILLED',
      meta: { cacheKey: 'file1-history' },
      payload: { data: history },
    })
    expect(next['file1-history']).toEqual({ loading: false, data: history })
    expect(next['file1-history'].data).toBe(history)
    expect(next['file2-history']).toBe(prev['file2-history'])
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'HISTORY/GET_HISTORY_REJECTED', meta: { cacheKey: 'file1-history' } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
