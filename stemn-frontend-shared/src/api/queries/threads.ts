/**
 * Threads: get (batched), list a project's threads (search), create, update, delete.
 *
 * Coexistence: the kanban board (ThreadsDisplay, desktop and website), the thread modal and the
 * mention modal still read `threads.data` / `threads.boards` and fetch them with the Redux actions.
 * Writes made here refresh the legacy entry when Redux holds one (`syncLegacyThread`), and legacy
 * writes invalidate these queries (`threadLegacyInvalidations`). Boards stay in Redux.
 */
import { keepPreviousData, queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useStore } from 'react-redux'
import type { Store } from 'redux'
import { pickId } from 'stemn-shared/utils/pickId'
import { createBatcher } from '../batch'
import { api, unwrap } from '../client'
import type { IThread } from '../models'
import type { ProjectThreadCreateBody, ThreadUpdateBody } from '../operations.gen'
import type { LegacyInvalidations } from '../query/invalidation'
import { queryKeys, type IThreadListParams } from '../query/keys'

const threadBatcher = createBatcher<IThread>({
  fetchMany: (ids) => unwrap(api.GET('/api/v1/threads', { params: { query: { ids } } })),
})

export const threadQueries = {
  /** Batched with the other threads requested within 20 ms (GET /threads?ids[]=...) */
  detail: (threadId: string) =>
    queryOptions({
      queryKey: queryKeys.threads.detail(threadId),
      queryFn: () => threadBatcher.load(threadId),
    }),
  /** Ids of a project's threads matching the criteria (the rows load the threads by id) */
  list: (params: IThreadListParams) =>
    queryOptions({
      queryKey: queryKeys.threads.list(params),
      queryFn: async ({ signal }) => {
        const results = await unwrap(
          api.GET('/api/v1/search', {
            params: {
              query: {
                type: 'thread',
                parentType: 'project',
                parentId: params.projectId,
                select: ['_id'],
                criteria: params.criteria,
                size: params.size,
                page: params.page,
              },
            },
            signal,
          }),
        )
        return results as { _id: string }[] // the search route is untyped (`unknown[]`): rows of the selected fields
      },
    }),
}

export const useThread = (threadId: string | undefined) =>
  useQuery({ ...threadQueries.detail(threadId || ''), enabled: Boolean(threadId) })

export const useThreadList = (params: IThreadListParams) =>
  useQuery({ ...threadQueries.list(params), placeholderData: keepPreviousData })

interface ILegacyThreadsState {
  auth?: { user?: { _id?: string } }
  threads?: {
    data?: Record<string, { data?: unknown } | undefined>
    boards?: Record<string, { data?: { groups?: { _id: string }[] } } | undefined>
  }
}

/** True when the legacy board of the thread is loaded and has its group (the reducers assume both) */
const legacyBoardHasGroup = (store: Store, thread: Pick<IThread, 'board' | 'group'>) => {
  const state = store.getState() as ILegacyThreadsState
  const groups = state.threads?.boards?.[thread.board]?.data?.groups
  return Boolean(groups && groups.some((group) => group._id === thread.group))
}

/** If the legacy slice holds this thread (board, modal), write the new version into it */
export const syncLegacyThread = (store: Store, thread: IThread) => {
  const state = store.getState() as ILegacyThreadsState
  if (state.threads?.data?.[thread._id]?.data) {
    store.dispatch({
      type: 'THREADS/GET_TASK_FULFILLED',
      payload: { data: thread },
      meta: { cacheKey: thread._id, fromQuery: true },
    })
  }
}

/** The request body for PUT /threads/:id: the populated references back to ids */
export const toThreadBody = (thread: IThread): ThreadUpdateBody => ({
  ...thread,
  owner: pickId(thread.owner),
  project: pickId(thread.project),
  users: thread.users.map(pickId),
})

export interface ICreateThreadInput {
  projectId: string
  thread: ProjectThreadCreateBody
}

export const useCreateThread = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  return useMutation({
    mutationKey: ['threads', 'create'],
    mutationFn: ({ projectId, thread }: ICreateThreadInput) => {
      const currentUserId = (store.getState() as ILegacyThreadsState).auth?.user?._id
      return unwrap(
        api.POST('/api/v1/projects/{projectId}/threads', {
          params: { path: { projectId } },
          body: { users: currentUserId ? [currentUserId] : [], ...thread },
        }),
      )
    },
    onSuccess: (thread, { projectId }) => {
      queryClient.setQueryData(queryKeys.threads.detail(thread._id), thread)
      // The board (Redux) lists each group's threads by id: add it there if the board is loaded
      if (legacyBoardHasGroup(store, thread)) {
        store.dispatch({
          type: 'THREADS/NEW_TASK_FULFILLED',
          payload: { data: thread },
          meta: { cacheKey: projectId, fromQuery: true },
        })
      }
      return queryClient.invalidateQueries({ queryKey: queryKeys.threads.projectLists(projectId) })
    },
  })
}

/**
 * Saves changes to one thread. The cache is updated at once (optimistic) and rolled back if the save
 * fails. The changes are merged into the cached thread and the whole thread is sent (the API's PUT
 * replaces the document), like the legacy updateThread. Saves of the same thread run one after the
 * other (mutation scope), so quick successive edits (labels, assignees) cannot overtake each other.
 */
export const useUpdateThread = (threadId: string) => {
  const queryClient = useQueryClient()
  const store = useStore()
  const queryKey = queryKeys.threads.detail(threadId)
  return useMutation({
    mutationKey: ['threads', 'update'],
    scope: { id: `thread-${threadId}` },
    mutationFn: ({ thread, changes }: { thread?: IThread; changes: Partial<IThread> }) => {
      // onMutate has merged the changes into the cache already
      const current = queryClient.getQueryData<IThread>(queryKey) || thread
      if (!current) throw new Error(`Thread ${threadId} is not loaded`)
      return unwrap(
        api.PUT('/api/v1/threads/{threadId}', {
          params: { path: { threadId } },
          body: toThreadBody({ ...current, ...changes }),
        }),
      )
    },
    onMutate: async ({ thread, changes }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<IThread>(queryKey)
      const base = previous || thread
      if (base) queryClient.setQueryData<IThread>(queryKey, { ...base, ...changes })
      return { previous }
    },
    onError: (_error, _input, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKey, updated)
      syncLegacyThread(store, updated)
      return queryClient.invalidateQueries({ queryKey: queryKeys.threads.lists() })
    },
  })
}

export const useDeleteThread = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  return useMutation({
    mutationKey: ['threads', 'delete'],
    mutationFn: ({ thread }: { thread: IThread }) =>
      unwrap(api.DELETE('/api/v1/threads/{threadId}', { params: { path: { threadId: thread._id } } })),
    onSuccess: (_deleted, { thread }) => {
      queryClient.removeQueries({ queryKey: queryKeys.threads.detail(thread._id) })
      const state = store.getState() as ILegacyThreadsState
      if (state.threads?.data?.[thread._id] && legacyBoardHasGroup(store, thread)) {
        store.dispatch({
          type: 'THREADS/DELETE_TASK_FULFILLED',
          payload: {},
          meta: { threadId: thread._id, boardId: thread.board, fromQuery: true },
        })
      }
      return queryClient.invalidateQueries({ queryKey: queryKeys.threads.lists() })
    },
  })
}

const threadId = (action: { meta?: Record<string, unknown> }, key: string) => {
  const value = action.meta?.[key]
  return typeof value === 'string' ? value : undefined
}

/** Legacy Redux writes (the board, the thread modal) that make thread queries stale */
export const threadLegacyInvalidations: LegacyInvalidations = {
  'THREADS/UPDATE_TASK_FULFILLED': (action) => {
    const id = threadId(action, 'cacheKey')
    return id ? [queryKeys.threads.detail(id), queryKeys.threads.lists()] : [queryKeys.threads.all]
  },
  'THREADS/DELETE_TASK_FULFILLED': () => [queryKeys.threads.lists()],
  'THREADS/NEW_TASK_FULFILLED': () => [queryKeys.threads.lists()],
  'THREADS/MOVE_TASK_FULFILLED': () => [queryKeys.threads.all],
  'THREADS/DELETE_GROUP_FULFILLED': () => [queryKeys.threads.all],
}
