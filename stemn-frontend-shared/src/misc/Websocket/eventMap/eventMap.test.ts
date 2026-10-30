import { QueryClient, QueryObserver } from '@tanstack/react-query'
import http from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setQueryClient } from 'stemn-shared/api/query/registry'
import thread, { TIMELINE_REVALIDATION_DELAY } from './thread'
import project from './project'
import board from './board'

vi.mock('axios', () => ({ default: vi.fn(() => Promise.resolve({ data: [] })) }))
vi.mock('stemn-shared/misc/SyncTimeline/SyncTimeline.actions', () => ({
  fetchTimeline: (input: object) => ({ type: 'TIMELINE/FETCH_TIMELINE', meta: input }),
}))
vi.mock('stemn-shared/misc/Threads/Threads.actions', () => ({
  getThread: (input: object) => ({ type: 'THREADS/GET_TASK', meta: input }),
  getGroup: (input: object) => ({ type: 'THREADS/GET_GROUP', meta: input }),
  getBoard: (input: object) => ({ type: 'THREADS/GET_BOARD', meta: input }),
}))
vi.mock('stemn-shared/misc/Threads/Threads.actions.js', () => ({
  getThread: (input: object) => ({ type: 'THREADS/GET_TASK', meta: input }),
  getGroup: (input: object) => ({ type: 'THREADS/GET_GROUP', meta: input }),
  getBoard: (input: object) => ({ type: 'THREADS/GET_BOARD', meta: input }),
}))
vi.mock('stemn-shared/misc/Projects/Projects.actions.js', () => ({
  getProject: (input: object) => ({ type: 'PROJECTS/GET_PROJECT', meta: input }),
  getUserProjects: (input: object) => ({ type: 'PROJECTS/GET_USER_PROJECTS', meta: input }),
}))
vi.mock('stemn-shared/misc/Changes/Changes.actions.js', () => ({ fetchChanges: () => ({ type: 'CHANGES/FETCH' }) }))

type Action = { type: string; payload?: { queryKeys?: unknown[] }; meta?: unknown }

const createStore = (state: object) => {
  const dispatched: Action[] = []
  return { dispatched, store: { getState: () => state, dispatch: (action: Action) => dispatched.push(action) } }
}

const state = {
  auth: { user: { _id: 'ada' } },
  threads: { data: { legacy: { data: {} } }, boards: { b1: { data: { project: 'p1' } } } },
}

describe('websocket event map', () => {
  afterEach(() => setQueryClient(undefined))

  it('THREAD/THREAD_UPDATED: revalidates the (Redux) timeline, invalidates the thread queries', () => {
    vi.useFakeTimers()
    const { store, dispatched } = createStore(state)
    thread(store, { type: 'THREAD/THREAD_UPDATED', payload: { threadId: 't1', actioner: 'priya' } })
    // The API's stale answer is not stored: the timeline is fetched into Redux once recomputed
    expect(http).toHaveBeenCalledWith({
      method: 'GET',
      url: '/api/v1/timeline',
      params: { entityId: 't1', size: 500, entityType: 'thread' },
    })
    expect(dispatched.map((action) => action.payload?.queryKeys)).toEqual([
      [['threads', 'list']],
      [['threads', 'detail', 't1']],
    ])
    vi.advanceTimersByTime(TIMELINE_REVALIDATION_DELAY)
    expect(dispatched.at(-1)).toEqual({
      type: 'TIMELINE/FETCH_TIMELINE',
      meta: { entityId: 't1', size: 500, entityType: 'thread' },
    })
    vi.useRealTimers()
  })

  it('refreshes the Redux copy only for threads Redux holds (board, thread modal)', () => {
    const { store, dispatched } = createStore(state)
    thread(store, { type: 'THREAD/THREAD_UPDATED', payload: { threadId: 'legacy' } })
    expect(dispatched.at(-1)).toEqual({ type: 'THREADS/GET_TASK', meta: { threadId: 'legacy' } })
  })

  it('skips the Redux refetch when a mounted component observes the query (website project page)', () => {
    const queryClient = new QueryClient()
    setQueryClient(queryClient)
    const observer = new QueryObserver(queryClient, {
      queryKey: ['projects', 'detail', 'p1'],
      queryFn: () => ({}),
      enabled: false,
    })
    const unsubscribe = observer.subscribe(() => undefined)
    const { store, dispatched } = createStore(state)
    project(store, { type: 'PROJECT/PROJECT_UPDATED', payload: { projectId: 'p1' } })
    project(store, { type: 'PROJECT/PROJECT_UPDATED', payload: { projectId: 'p2' } })
    unsubscribe()
    expect(dispatched.map((action) => action.type)).toEqual([
      'API/INVALIDATE_QUERIES',
      'API/INVALIDATE_QUERIES',
      'PROJECTS/GET_PROJECT', // p2 is only in Redux
    ])
  })

  it('THREAD/COMMENT_UPDATED invalidates the comment; BOARD/GROUPS_UPDATED the project thread lists', () => {
    const { store, dispatched } = createStore(state)
    thread(store, { type: 'THREAD/COMMENT_UPDATED', payload: { threadId: 't1', comment: 'c1' } })
    board(store, { type: 'BOARD/GROUPS_UPDATED', payload: { boardId: 'b1', groups: ['g1'], actioner: 'priya' } })
    board(store, { type: 'BOARD/GROUPS_UPDATED', payload: { boardId: 'b1', groups: ['g1'], actioner: 'ada' } }) // own change
    expect(dispatched).toEqual([
      { type: 'API/INVALIDATE_QUERIES', payload: { queryKeys: [['comments', 'detail', 'c1']] } },
      { type: 'API/INVALIDATE_QUERIES', payload: { queryKeys: [['threads', 'list', { projectId: 'p1' }]] } },
      { type: 'THREADS/GET_GROUP', meta: { groupId: 'g1', boardId: 'b1' } },
    ])
  })
})
