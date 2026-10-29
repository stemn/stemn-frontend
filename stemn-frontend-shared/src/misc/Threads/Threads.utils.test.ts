import { describe, expect, it } from 'vitest'
import { filterBoard } from './Threads.utils'

const threads: any = {
  t1: { data: { name: 'Fix hinge', group: 'g1', labels: ['bug'], users: [{ _id: 'u1' }], complete: false } },
  t2: { data: { name: 'Write docs', group: 'g1', labels: [], users: [], complete: true } },
  t3: { data: { name: 'Hinge v2', group: 'g2', labels: ['bug'], users: [{ _id: 'u2' }], complete: false } },
}

describe('filterBoard', () => {
  const board: any = {
    loading: false,
    data: {
      _id: 'board1',
      labels: [{ _id: 'bug' }],
      groups: [
        { _id: 'g1', name: 'To do', threads: ['t1', 't2'] },
        { _id: 'g2', name: 'Done', threads: ['t3', 'unknown'] },
      ],
    },
  }

  it('filters the threads of every group without touching the input', () => {
    const next = filterBoard(board, threads, { query: 'hinge', status: 'open' })
    expect(next.data.groups.map((group) => group.threads)).toEqual([['t1'], ['t3', 'unknown']])
    expect(next.data.groups[0]).toEqual({ ...board.data.groups[0], threads: ['t1'] })
    expect(next.data.labels).toBe(board.data.labels)
    expect(board.data.groups[0].threads).toEqual(['t1', 't2'])
  })

  it('keeps every thread with an empty filter', () => {
    const next = filterBoard(board, threads)
    expect(next).toEqual(board)
  })
})
