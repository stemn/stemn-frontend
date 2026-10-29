import { describe, expect, it } from 'vitest'
import reducer from './Toasts.reducer'

const toast = (id: string) => ({ id, type: 'error', title: `Toast ${id}`, actions: [] })

describe('Toasts reducer', () => {
  const prev = { stack: [toast('t1'), toast('t2'), toast('t3')], other: { x: 1 } }

  it('TOAST/SHOW pushes the toast onto a new stack', () => {
    const next = reducer(prev, { type: 'TOAST/SHOW', payload: toast('t4') })
    expect(next.stack.map((item) => item.id)).toEqual(['t1', 't2', 't3', 't4'])
    expect(next.stack).not.toBe(prev.stack)
    expect(next.stack[0]).toBe(prev.stack[0])
    expect(next.other).toBe(prev.other)
    expect(prev.stack).toHaveLength(3)
  })

  it('TOAST/HIDE removes the toast', () => {
    const next = reducer(prev, { type: 'TOAST/HIDE', payload: { id: 't2' } })
    expect(next.stack.map((item) => item.id)).toEqual(['t1', 't3'])
    expect(next.stack[1]).toBe(prev.stack[2])
    expect(next.other).toBe(prev.other)
  })

  it('TOAST/HIDE with an unknown id removes the last toast (splice(-1) behaviour)', () => {
    const next = reducer(prev, { type: 'TOAST/HIDE', payload: { id: 'unknown' } })
    expect(next.stack.map((item) => item.id)).toEqual(['t1', 't2'])
  })

  it('returns the same state for unknown actions', () => {
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
