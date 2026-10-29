import { describe, expect, it } from 'vitest'
import reducer from './TogglePanel.reducer'

describe('TogglePanel reducer', () => {
  const prev = { 'thread-1': true, 'thread-2': false }

  it('TOGGLE_PANEL/TOGGLE sets the panel value', () => {
    const next = reducer(prev, { type: 'TOGGLE_PANEL/TOGGLE', payload: { cacheKey: 'thread-2', value: true } })
    expect(next).toEqual({ 'thread-1': true, 'thread-2': true })
    expect(next).not.toBe(prev)
    expect(prev['thread-2']).toBe(false)
  })

  it('TOGGLE_PANEL/TOGGLE returns the same state when the value is unchanged', () => {
    expect(reducer(prev, { type: 'TOGGLE_PANEL/TOGGLE', payload: { cacheKey: 'thread-1', value: true } })).toBe(prev)
  })

  it('TOGGLE_PANEL/TOGGLE_MULTI sets several panels', () => {
    const next = reducer(prev, {
      type: 'TOGGLE_PANEL/TOGGLE_MULTI',
      payload: { cacheKeys: ['thread-1', 'thread-3'], value: false },
    })
    expect(next).toEqual({ 'thread-1': false, 'thread-2': false, 'thread-3': false })
  })

  it('returns the same state for unknown actions', () => {
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
