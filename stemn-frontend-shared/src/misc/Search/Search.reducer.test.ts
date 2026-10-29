import { describe, expect, it } from 'vitest'
import reducer from './Search.reducer'

describe('Search reducer', () => {
  const prev: any = {
    query: 'gear',
    data: {
      'project-gear': { loading: false, data: [{ _id: 'p1' }] },
      'user-gear': { loading: false, data: [] },
    },
  }

  it('SEARCH/SET_QUERY sets the query', () => {
    const next = reducer(prev, { type: 'SEARCH/SET_QUERY', payload: 'motor' })
    expect(next).toEqual({ ...prev, query: 'motor' })
    expect(next.data).toBe(prev.data)
  })

  it('SEARCH/SEARCH_PENDING and SEARCH/SEARCH_REJECTED set loading', () => {
    for (const type of ['SEARCH/SEARCH_PENDING', 'SEARCH/SEARCH_REJECTED']) {
      const next = reducer(prev, { type, meta: { cacheKey: 'project-gear' } })
      expect(next.data['project-gear']).toEqual({ loading: true, data: [{ _id: 'p1' }] })
      expect(next.data['project-gear'].data).toBe(prev.data['project-gear'].data)
      expect(next.data['user-gear']).toBe(prev.data['user-gear'])
    }
  })

  it('SEARCH/SEARCH_FULFILLED stores the results', () => {
    const data = [{ _id: 'p2', name: 'Gearbox' }]
    const next = reducer(prev, {
      type: 'SEARCH/SEARCH_FULFILLED',
      meta: { cacheKey: 'project-motor' },
      payload: { data },
    })
    expect(next.data['project-motor']).toEqual({ loading: false, data })
    expect(next.data['project-gear']).toBe(prev.data['project-gear'])
    expect(next.query).toBe('gear')
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'SEARCH/SET_QUERY', payload: 'gear' })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
