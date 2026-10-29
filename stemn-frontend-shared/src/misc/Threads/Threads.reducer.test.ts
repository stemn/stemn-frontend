import { describe, expect, it } from 'vitest'
import reducer from './Threads.reducer'

const thread = (id: string, group: string) => ({
  _id: id,
  name: `Thread ${id}`,
  board: 'board1',
  group,
  complete: false,
})

const makeState = (): any => ({
  hydrated: true,
  data: {
    t1: { loading: false, data: thread('t1', 'g1') },
    t2: { loading: false, data: thread('t2', 'g1') },
    t3: { loading: false, data: thread('t3', 'g2') },
  },
  projects: { project1: { loading: false, boards: ['board1'] }, project2: { loading: false, boards: [] } },
  boards: {
    board1: {
      loading: false,
      layout: 'board',
      newThreadString: { g1: 'Half typed' },
      data: {
        _id: 'board1',
        name: 'Main board',
        labels: [{ _id: 'l1', name: 'bug' }],
        groups: [
          { _id: 'g1', name: 'To do', threads: ['t1', 't2'] },
          { _id: 'g2', name: 'Done', threads: ['t3'] },
        ],
      },
    },
    board2: { loading: false, data: { _id: 'board2', groups: [] } },
  },
})

describe('Threads reducer', () => {
  const prev = makeState()
  const groups = prev.boards.board1.data.groups

  it('hydrates a persisted state with the initial keys', () => {
    const next = reducer({ boards: {} }, { type: 'OTHER' })
    expect(next).toMatchObject({ data: {}, projects: {}, boards: {}, hydrated: true })
  })

  it('THREADS/NEW_TASK_FULFILLED adds the thread to the data and its group', () => {
    const data = thread('t4', 'g2')
    const next = reducer(prev, { type: 'THREADS/NEW_TASK_FULFILLED', payload: { data } })
    expect(next.data.t4).toEqual({ data })
    expect(next.data.t1).toBe(prev.data.t1)
    expect(next.boards.board1.newThreadString).toEqual({ g1: 'Half typed', g2: '' })
    expect(next.boards.board1.data.groups[1].threads).toEqual(['t3', 't4'])
    expect(next.boards.board1.data.groups[0]).toBe(groups[0])
    expect(next.boards.board1.data.labels).toBe(prev.boards.board1.data.labels)
    expect(next.boards.board2).toBe(prev.boards.board2)
    expect(next.projects).toBe(prev.projects)
    expect(groups[1].threads).toEqual(['t3'])
  })

  it('THREADS/GET_BOARDS_PENDING and _REJECTED toggle loading', () => {
    const pending = reducer(prev, { type: 'THREADS/GET_BOARDS_PENDING', meta: { cacheKey: 'project1' } })
    expect(pending.projects.project1).toEqual({ loading: true, boards: ['board1'] })
    expect(pending.projects.project2).toBe(prev.projects.project2)
    expect(pending.boards).toBe(prev.boards)
    const rejected = reducer(pending, { type: 'THREADS/GET_BOARDS_REJECTED', meta: { cacheKey: 'project1' } })
    expect(rejected.projects.project1.loading).toBe(false)
  })

  it('THREADS/GET_BOARDS_FULFILLED deep-merges the first board', () => {
    const board = { _id: 'board1', name: 'Renamed', groups: [{ _id: 'g1', name: 'To do', threads: ['t1'] }] }
    const next = reducer(prev, {
      type: 'THREADS/GET_BOARDS_FULFILLED',
      meta: { cacheKey: 'project1' },
      payload: { data: [board] },
    })
    expect(next.projects.project1).toEqual({ loading: false, boards: ['board1'] })
    expect(next.projects.project2).toBe(prev.projects.project2)
    // The board data is merged: keys missing from the response (labels) are kept, arrays are replaced
    expect(next.boards.board1.data).toEqual({ ...prev.boards.board1.data, name: 'Renamed', groups: board.groups })
    expect(next.boards.board1.data.labels).toBe(prev.boards.board1.data.labels)
    expect(next.boards.board1.newThreadString).toBe(prev.boards.board1.newThreadString)
    expect(next.boards.board2).toBe(prev.boards.board2)
    expect(next.data).toBe(prev.data)
  })

  it('THREADS/GET_BOARDS_FULFILLED without boards stores an empty list', () => {
    const next = reducer(prev, {
      type: 'THREADS/GET_BOARDS_FULFILLED',
      meta: { cacheKey: 'project3' },
      payload: { data: [] },
    })
    expect(next.projects.project3).toEqual({ boards: [], loading: false })
    expect(next.boards).toBe(prev.boards)
  })

  it('THREADS/GET_BOARD_PENDING and _REJECTED toggle loading', () => {
    const pending = reducer(prev, { type: 'THREADS/GET_BOARD_PENDING', meta: { cacheKey: 'board2' } })
    expect(pending.boards.board2.loading).toBe(true)
    expect(pending.boards.board2.data).toBe(prev.boards.board2.data)
    expect(pending.boards.board1).toBe(prev.boards.board1)
    const rejected = reducer(pending, { type: 'THREADS/GET_BOARD_REJECTED', meta: { cacheKey: 'board2' } })
    expect(rejected.boards.board2.loading).toBe(false)
  })

  it('THREADS/GET_BOARD_FULFILLED stores the board (loading stays true, existing behaviour)', () => {
    const data = { _id: 'board2', groups: [{ _id: 'g9', threads: [] }] }
    const next = reducer(prev, { type: 'THREADS/GET_BOARD_FULFILLED', meta: { cacheKey: 'board2' }, payload: { data } })
    expect(next.boards.board2).toEqual({ loading: true, data })
    expect(next.boards.board1).toBe(prev.boards.board1)
  })

  it('THREADS/GET_GROUP_FULFILLED replaces the group', () => {
    const data = { _id: 'g2', name: 'Shipped', threads: ['t3'] }
    const next = reducer(prev, { type: 'THREADS/GET_GROUP_FULFILLED', meta: { boardId: 'board1' }, payload: { data } })
    expect(next.boards.board1.data.groups).toEqual([groups[0], data])
    expect(next.boards.board1.data.groups[0]).toBe(groups[0])
    expect(next.boards.board2).toBe(prev.boards.board2)
  })

  it('THREADS/GET_TASK_PENDING / _REJECTED / _FULFILLED track the thread', () => {
    const pending = reducer(prev, { type: 'THREADS/GET_TASK_PENDING', meta: { cacheKey: 't1' } })
    expect(pending.data.t1).toEqual({ loading: true, data: prev.data.t1.data })
    expect(pending.data.t2).toBe(prev.data.t2)
    expect(pending.boards).toBe(prev.boards)

    const rejected = reducer(prev, {
      type: 'THREADS/GET_TASK_REJECTED',
      meta: { cacheKey: 't1' },
      payload: { data: { error: 'Not found' } },
    })
    expect(rejected.data.t1).toEqual({ error: 'Not found', loading: false })

    const data = { ...thread('t1', 'g1'), name: 'Renamed' }
    const fulfilled = reducer(prev, { type: 'THREADS/GET_TASK_FULFILLED', meta: { cacheKey: 't1' }, payload: { data } })
    expect(fulfilled.data.t1).toEqual({ data, loading: false })
    expect(fulfilled.data.t2).toBe(prev.data.t2)
  })

  it('THREADS/UPDATE_BOARD_PENDING / _REJECTED / _FULFILLED track the board save', () => {
    const pending = reducer(prev, { type: 'THREADS/UPDATE_BOARD_PENDING', meta: { cacheKey: 'board1' } })
    expect(pending.boards.board1.savePending).toBe(true)
    expect(pending.boards.board1.data).toBe(prev.boards.board1.data)
    expect(pending.boards.board2).toBe(prev.boards.board2)
    const rejected = reducer(pending, { type: 'THREADS/UPDATE_BOARD_REJECTED', meta: { cacheKey: 'board1' } })
    expect(rejected.boards.board1.savePending).toBe(false)
    const data = { _id: 'board1', groups: [] }
    const fulfilled = reducer(pending, {
      type: 'THREADS/UPDATE_BOARD_FULFILLED',
      meta: { cacheKey: 'board1' },
      payload: { data },
    })
    expect(fulfilled.boards.board1.savePending).toBe(false)
    expect(fulfilled.boards.board1.data).toBe(data)
  })

  it('THREADS/NEW_GROUP_FULFILLED resets the string and adds the group', () => {
    const data = { _id: 'g3', name: 'Review', threads: [] }
    const next = reducer(prev, { type: 'THREADS/NEW_GROUP_FULFILLED', meta: { boardId: 'board1' }, payload: { data } })
    expect(next.boards.board1.newGroupString).toBe('')
    expect(next.boards.board1.data.groups).toEqual([...groups, data])
    expect(next.boards.board1.data.groups[0]).toBe(groups[0])
    expect(next.boards.board2).toBe(prev.boards.board2)
  })

  it('THREADS/DELETE_GROUP_FULFILLED removes the group', () => {
    const next = reducer(prev, { type: 'THREADS/DELETE_GROUP_FULFILLED', meta: { boardId: 'board1', groupId: 'g1' } })
    expect(next.boards.board1.data.groups).toEqual([groups[1]])
    expect(next.boards.board1.data.groups[0]).toBe(groups[1])
    expect(next.data).toBe(prev.data)
  })

  it('THREADS/DELETE_TASK_FULFILLED removes the thread from the data and its group', () => {
    const next = reducer(prev, { type: 'THREADS/DELETE_TASK_FULFILLED', meta: { boardId: 'board1', threadId: 't1' } })
    expect(next.data).toHaveProperty('t1', undefined)
    expect(next.data.t2).toBe(prev.data.t2)
    expect(next.boards.board1.data.groups[0].threads).toEqual(['t2'])
    expect(next.boards.board1.data.groups[1]).toBe(groups[1])
    expect(next.boards.board2).toBe(prev.boards.board2)
  })

  it('THREADS/MOVE_TASK moves the thread within and across groups', () => {
    const across = reducer(prev, {
      type: 'THREADS/MOVE_TASK',
      payload: { boardId: 'board1', thread: 't1', destinationGroup: 'g2', destinationThread: 't3' },
    })
    expect(across.data.t1.data.group).toBe('g2')
    expect(across.data.t2).toBe(prev.data.t2)
    expect(across.boards.board1.data.groups.map((group) => group.threads)).toEqual([['t2'], ['t1', 't3']])
    expect(across.boards.board2).toBe(prev.boards.board2)
    expect(groups[0].threads).toEqual(['t1', 't2'])

    const toEmptyEnd = reducer(prev, {
      type: 'THREADS/MOVE_TASK',
      payload: { boardId: 'board1', thread: 't3', destinationGroup: 'g1' },
    })
    expect(toEmptyEnd.boards.board1.data.groups.map((group) => group.threads)).toEqual([['t3', 't1', 't2'], []])

    const within = reducer(prev, {
      type: 'THREADS/MOVE_TASK',
      payload: { boardId: 'board1', thread: 't2', destinationGroup: 'g1', destinationThread: 't1' },
    })
    expect(within.boards.board1.data.groups[0].threads).toEqual(['t2', 't1'])
  })

  it('THREADS/MOVE_TASK_FULFILLED does not change the state', () => {
    expect(reducer(prev, { type: 'THREADS/MOVE_TASK_FULFILLED' })).toBe(prev)
  })

  it('THREADS/MOVE_GROUP reorders the groups', () => {
    const next = reducer(prev, {
      type: 'THREADS/MOVE_GROUP',
      payload: { boardId: 'board1', group: 'g2', destinationGroup: 'g1' },
    })
    expect(next.boards.board1.data.groups.map((group) => group._id)).toEqual(['g2', 'g1'])
    expect(next.boards.board1.data.labels).toBe(prev.boards.board1.data.labels)
    expect(next.boards.board2).toBe(prev.boards.board2)
  })

  it('THREADS/BEGIN_DRAG and THREADS/END_DRAG toggle isDragging', () => {
    const dragging = reducer(prev, { type: 'THREADS/BEGIN_DRAG', payload: { threadId: 't1' } })
    expect(dragging.data.t1.isDragging).toBe(true)
    expect(dragging.data.t1.data).toBe(prev.data.t1.data)
    expect(dragging.data.t2).toBe(prev.data.t2)
    const dropped = reducer(dragging, { type: 'THREADS/END_DRAG', payload: { threadId: 't1' } })
    expect(dropped.data.t1.isDragging).toBe(false)
  })

  it('THREADS/CHANGE_LAYOUT sets the layout', () => {
    const next = reducer(prev, { type: 'THREADS/CHANGE_LAYOUT', payload: { boardId: 'board1', layout: 'list' } })
    expect(next.boards.board1.layout).toBe('list')
    expect(next.boards.board1.data).toBe(prev.boards.board1.data)
    expect(next.boards.board2).toBe(prev.boards.board2)
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'THREADS/CHANGE_LAYOUT', payload: { boardId: 'board1', layout: 'board' } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
