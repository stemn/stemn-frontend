import { describe, expect, it } from 'vitest'
import reducer from './StringFilter.reducer'

describe('StringFilter reducer', () => {
  const prev = {
    'board-1': { string: 'is:open', object: { status: 'open' } },
    'board-2': { string: '', object: {} },
  }

  it('STRING_FILTER/SET_FILTER stores the filter', () => {
    const payload = { string: 'is:closed label:bug', object: { status: 'closed', labels: ['bug'] } }
    const next = reducer(prev, { type: 'STRING_FILTER/SET_FILTER', meta: { cacheKey: 'board-1' }, payload })
    expect(next['board-1']).toBe(payload)
    expect(next['board-2']).toBe(prev['board-2'])
  })

  it('returns the same state when the filter is the same object or the action is unknown', () => {
    const action = { type: 'STRING_FILTER/SET_FILTER', meta: { cacheKey: 'board-1' }, payload: prev['board-1'] }
    expect(reducer(prev, action)).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
