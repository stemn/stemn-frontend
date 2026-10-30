import { describe, expect, it, vi } from 'vitest'
import { createSequencer } from './sequencer'

const collect = (options: { gapTimeout?: number; onGap?: (missing: number[]) => void } = {}) => {
  const delivered: number[] = []
  const sequencer = createSequencer<{ seq: number; session?: string }>({
    deliver: (message) => delivered.push(message.seq),
    ...options,
  })
  return { delivered, sequencer }
}

describe('createSequencer', () => {
  it('delivers in order', () => {
    const { delivered, sequencer } = collect()
    ;[1, 2, 3].forEach((seq) => sequencer.push({ seq }))
    expect(delivered).toEqual([1, 2, 3])
  })

  it('reorders out-of-order messages', () => {
    const { delivered, sequencer } = collect()
    ;[2, 3, 1, 5, 4].forEach((seq) => sequencer.push({ seq }))
    expect(delivered).toEqual([1, 2, 3, 4, 5])
    expect(sequencer.pending()).toBe(0)
  })

  it('drops duplicates', () => {
    const { delivered, sequencer } = collect()
    ;[1, 1, 2, 2].forEach((seq) => sequencer.push({ seq }))
    expect(delivered).toEqual([1, 2])
  })

  it('skips a gap after the timeout', () => {
    vi.useFakeTimers()
    const { delivered, sequencer } = collect({ gapTimeout: 100 })
    sequencer.push({ seq: 1 })
    sequencer.push({ seq: 3 })
    sequencer.push({ seq: 4 })
    expect(delivered).toEqual([1])
    vi.advanceTimersByTime(100)
    expect(delivered).toEqual([1, 3, 4])
    // the late message is still delivered, once
    sequencer.push({ seq: 2 })
    sequencer.push({ seq: 2 })
    expect(delivered).toEqual([1, 3, 4, 2])
    vi.useRealTimers()
  })

  it('reports the numbers it gave up on', () => {
    vi.useFakeTimers()
    const gaps: number[][] = []
    const { delivered, sequencer } = collect({ gapTimeout: 50, onGap: (missing) => gaps.push(missing) })
    sequencer.push({ seq: 1 })
    sequencer.push({ seq: 4 })
    vi.advanceTimersByTime(50)
    expect(gaps).toEqual([[2, 3]])
    expect(delivered).toEqual([1, 4])
    vi.useRealTimers()
  })

  it('starts over when the sender restarts', () => {
    const { delivered, sequencer } = collect()
    sequencer.push({ seq: 1, session: 'a' })
    sequencer.push({ seq: 2, session: 'a' })
    sequencer.push({ seq: 1, session: 'b' })
    sequencer.push({ seq: 2, session: 'b' })
    expect(delivered).toEqual([1, 2, 1, 2])
  })

  it('starts at the first number seen of a session', () => {
    const { delivered, sequencer } = collect()
    sequencer.push({ seq: 7, session: 'x' })
    sequencer.push({ seq: 8, session: 'x' })
    expect(delivered).toEqual([7, 8])
  })

  it('skipThrough drops what a snapshot already contains', () => {
    const { delivered, sequencer } = collect()
    sequencer.skipThrough(0)
    ;[3, 4].forEach((seq) => sequencer.push({ seq }))
    sequencer.skipThrough(3)
    expect(delivered).toEqual([4])
    sequencer.push({ seq: 5 })
    expect(delivered).toEqual([4, 5])
  })

  it('reset expects a session and number', () => {
    const { delivered, sequencer } = collect()
    sequencer.reset('core-1', 5)
    sequencer.push({ seq: 4, session: 'core-1' })
    sequencer.push({ seq: 6, session: 'core-1' })
    sequencer.push({ seq: 5, session: 'core-1' })
    expect(delivered).toEqual([5, 6])
  })
})
