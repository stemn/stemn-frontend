import { describe, expect, it } from 'vitest'
import reducer from './Terminal.reducer'

describe('Terminal reducer', () => {
  const prev: any = {
    hydrated: true,
    lines: { step1: [{ number: 0, data: 'npm install' }], step2: [] },
    loading: { step1: false },
    hasLoadedBefore: { step1: true },
  }

  it('hydrates a persisted state with the initial keys', () => {
    const next = reducer({ lines: { step1: [] } }, { type: 'OTHER' })
    expect(next).toEqual({ lines: { step1: [] }, loading: {}, hasLoadedBefore: {}, hydrated: true })
  })

  it('TERMINAL/ADD_LINES stores the lines', () => {
    const next = reducer(prev, {
      type: 'TERMINAL/ADD_LINES',
      meta: { stepId: 'step2' },
      payload: {
        lines: [
          [0, 'Building'],
          [1, 'Done'],
        ],
      },
    })
    expect(next.lines.step2).toEqual([
      { number: 0, data: 'Building' },
      { number: 1, data: 'Done' },
    ])
    expect(next.lines.step1).toBe(prev.lines.step1)
    expect(next.loading).toBe(prev.loading)
  })

  it('TERMINAL/GET_LINES_PENDING sets loading', () => {
    const next = reducer(prev, { type: 'TERMINAL/GET_LINES_PENDING', meta: { stepId: 'step2' } })
    expect(next.loading).toEqual({ step1: false, step2: true })
    expect(next.lines).toBe(prev.lines)
    expect(next.hasLoadedBefore).toBe(prev.hasLoadedBefore)
  })

  it('TERMINAL/GET_LINES_REJECTED clears loading and marks as loaded before', () => {
    const next = reducer(prev, { type: 'TERMINAL/GET_LINES_REJECTED', meta: { stepId: 'step2' } })
    expect(next.loading.step2).toBe(false)
    expect(next.hasLoadedBefore.step2).toBe(true)
    expect(next.lines).toBe(prev.lines)
  })

  it('TERMINAL/GET_LINES_FULFILLED parses the log into lines', () => {
    const next = reducer(prev, {
      type: 'TERMINAL/GET_LINES_FULFILLED',
      meta: { stepId: 'step2' },
      payload: { data: 'line one\nline two' },
    })
    // lodash/fp `map` caps the iteratee to one argument, so `number` (the index) is undefined
    expect(next.lines.step2).toEqual([
      { number: undefined, data: 'line one' },
      { number: undefined, data: 'line two' },
    ])
    expect(next.lines.step1).toBe(prev.lines.step1)
    expect(next.loading.step2).toBe(false)
    expect(next.hasLoadedBefore.step2).toBe(true)
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'TERMINAL/GET_LINES_REJECTED', meta: { stepId: 'step1' } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
