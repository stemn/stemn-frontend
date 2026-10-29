import { describe, expect, it } from 'vitest'
import reducer from './Walkthrough.reducer'

describe('Walkthrough reducer', () => {
  const prev = { active: ['projectNew'], other: { seen: true } }

  it('WALKTHROUGH/ACTIVATE adds the step', () => {
    const next = reducer(prev, { type: 'WALKTHROUGH/ACTIVATE', payload: { name: 'threadsBoard' } })
    expect(next.active).toEqual(['projectNew', 'threadsBoard'])
    expect(next.other).toBe(prev.other)
    expect(prev.active).toEqual(['projectNew'])
  })

  it('WALKTHROUGH/ACTIVATE returns the same state when the step is already active', () => {
    expect(reducer(prev, { type: 'WALKTHROUGH/ACTIVATE', payload: { name: 'projectNew' } })).toBe(prev)
  })

  it('WALKTHROUGH/DEACTIVATE removes the step', () => {
    const next = reducer(prev, { type: 'WALKTHROUGH/DEACTIVATE', payload: { name: 'projectNew' } })
    expect(next.active).toEqual([])
    expect(next.other).toBe(prev.other)
  })

  it('WALKTHROUGH/DEACTIVATE returns the same state when the step is not active', () => {
    expect(reducer(prev, { type: 'WALKTHROUGH/DEACTIVATE', payload: { name: 'threadsBoard' } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
