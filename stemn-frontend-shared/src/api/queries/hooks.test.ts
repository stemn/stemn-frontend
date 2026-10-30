// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { connectLegacyBridge } from '../query/legacyBridge'
import { queryKeys } from '../query/keys'
import { setQueryClient } from '../query/registry'
import { comment, notification, project, thread } from '../testing/fixtures'
import { apiHandler } from '../testing/msw'
import { createTestQueryClient, createTestStore, createWrapper, type ITestState } from '../testing/providers'
import { useComment, useCreateComment, useToggleReaction } from './comments'
import { loadMe, useMe } from './me'
import { selectUnread, useMarkNotificationRead, useNotifications } from './notifications'
import { useProject, useUserProjects } from './projects'
import { useCreateThread, useThread, useUpdateThread } from './threads'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const loggedIn: ITestState = {
  auth: { authToken: 'token', user: { _id: 'ada', name: 'Ada Lovelace', picture: '' } },
  threads: { data: {}, boards: {} },
  syncTimeline: {},
}

const setup = (state: ITestState = loggedIn) => {
  const queryClient = createTestQueryClient()
  const { store, actions } = createTestStore(queryClient, state)
  return { queryClient, store, actions, wrapper: createWrapper(queryClient, store) }
}

/** Resolves a request later (to look at the optimistic state in between) */
const deferred = () => {
  let release: () => void = () => undefined
  const promise = new Promise<void>((resolve) => {
    release = resolve
  })
  return { promise, release }
}

describe('threads', () => {
  it('batches the threads requested together into one GET /threads?ids[]=', async () => {
    const requests: string[] = []
    server.use(
      apiHandler('ThreadList', ({ request }) => {
        const ids = new URL(request.url).searchParams.getAll('ids[]')
        requests.push(ids.join(','))
        return HttpResponse.json(ids.map((id) => thread(id)))
      }),
    )
    const { wrapper } = setup()
    const { result } = renderHook(() => [useThread('t1'), useThread('t2')], { wrapper })
    await waitFor(() => expect(result.current.every((query) => query.isSuccess)).toBe(true))
    expect(result.current.map((query) => query.data?.name)).toEqual(['Thread t1', 'Thread t2'])
    expect(requests).toEqual(['t1,t2'])
  })

  it('updates a thread optimistically, sends ids for the populated references, and rolls back on error', async () => {
    const t1 = thread('t1')
    const bodies: unknown[] = []
    const gate = deferred()
    server.use(
      apiHandler('ThreadUpdate', async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>
        bodies.push(body)
        await gate.promise
        return body.complete
          ? HttpResponse.json({ error: { code: 401, type: 'UNAUTHORIZED', message: 'No' } }, { status: 401 })
          : HttpResponse.json({ ...t1, ...body, owner: t1.owner, project: t1.project, users: t1.users })
      }),
    )
    const { queryClient, wrapper } = setup()
    queryClient.setQueryData(queryKeys.threads.detail('t1'), t1)
    const { result } = renderHook(() => ({ thread: useThread('t1'), update: useUpdateThread('t1') }), { wrapper })

    act(() => result.current.update.mutate({ changes: { name: 'Renamed' } }))
    await waitFor(() => expect(result.current.thread.data?.name).toBe('Renamed')) // before the response
    gate.release()
    await waitFor(() => expect(result.current.update.isSuccess).toBe(true))
    expect(bodies[0]).toMatchObject({ name: 'Renamed', owner: 'ada', project: 'p1', users: ['ada'] })

    act(() => result.current.update.mutate({ changes: { complete: true } }))
    await waitFor(() => expect(result.current.update.isError).toBe(true))
    expect(result.current.thread.data).toMatchObject({ name: 'Renamed', complete: false })
    expect(result.current.update.error).toMatchObject({ status: 401, type: 'UNAUTHORIZED' })
  })

  it('saves successive edits of a thread one after the other (mutation scope)', async () => {
    const t1 = thread('t1')
    let inFlight = 0
    let maxInFlight = 0
    const received: string[][] = []
    server.use(
      apiHandler('ThreadUpdate', async ({ request }) => {
        inFlight += 1
        maxInFlight = Math.max(maxInFlight, inFlight)
        const body = (await request.json()) as { labels: string[] }
        received.push(body.labels)
        await new Promise((resolve) => setTimeout(resolve, 10))
        inFlight -= 1
        return HttpResponse.json({ ...t1, labels: body.labels })
      }),
    )
    const { queryClient, wrapper } = setup()
    queryClient.setQueryData(queryKeys.threads.detail('t1'), t1)
    const { result } = renderHook(() => useUpdateThread('t1'), { wrapper })
    await act(async () => {
      await Promise.all([
        result.current.mutateAsync({ changes: { labels: ['l1'] } }),
        result.current.mutateAsync({ changes: { labels: ['l1', 'l2'] } }),
      ])
    })
    expect(maxInFlight).toBe(1)
    expect(received).toEqual([['l1'], ['l1', 'l2']])
    expect(queryClient.getQueryData(queryKeys.threads.detail('t1'))).toMatchObject({ labels: ['l1', 'l2'] })
  })

  it('creates a thread assigned to the current user, caches it and refreshes the project lists', async () => {
    let body: unknown
    server.use(
      apiHandler('ProjectThreadCreate', async ({ request }) => {
        body = await request.json()
        return HttpResponse.json(thread('new', { name: 'New' }))
      }),
    )
    const { queryClient, wrapper } = setup()
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreateThread(), { wrapper })
    await act(() => result.current.mutateAsync({ projectId: 'p1', thread: { name: 'New', board: 'b1', group: 'g1' } }))
    expect(body).toEqual({ users: ['ada'], name: 'New', board: 'b1', group: 'g1' })
    expect(queryClient.getQueryData(queryKeys.threads.detail('new'))).toMatchObject({ name: 'New' })
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['threads', 'list', { projectId: 'p1' }] })
  })
})

describe('comments', () => {
  it('creates a comment: caches it and adds its event to the (Redux) thread timeline', async () => {
    server.use(apiHandler('ThreadCommentCreate', () => HttpResponse.json(comment('c1', { body: 'Hello' }))))
    const { queryClient, wrapper, actions } = setup()
    const { result } = renderHook(() => useCreateComment(), { wrapper })
    await act(() => result.current.mutateAsync({ threadId: 't1', body: 'Hello', timelineCacheKey: 't1' }))
    expect(queryClient.getQueryData(queryKeys.comments.detail('c1'))).toMatchObject({ body: 'Hello' })
    expect(actions.find((action) => action.type === 'TIMELINE/ADD_EVENT')).toMatchObject({
      payload: { cacheKey: 't1', event: { event: 'comment', data: { comment: 'c1' }, user: { _id: 'ada' } } },
    })
  })

  it('toggles a reaction: adds it optimistically, then removes it', async () => {
    const calls: string[] = []
    server.use(
      apiHandler('CommentReactionCreate', () => {
        calls.push('POST')
        return HttpResponse.json({ type: 'like', owner: { _id: 'ada' } })
      }),
      apiHandler('CommentReactionRemove', ({ params }) => {
        calls.push(`DELETE ${params.reaction}`)
        return new HttpResponse(null, { status: 200 })
      }),
      apiHandler('CommentList', () => HttpResponse.json([comment('c1')])),
    )
    const { wrapper } = setup()
    const { result } = renderHook(() => ({ comment: useComment('c1'), toggle: useToggleReaction() }), { wrapper })
    await waitFor(() => expect(result.current.comment.data).toBeDefined())

    await act(() => result.current.toggle.mutateAsync({ comment: result.current.comment.data!, reactionType: 'like' }))
    expect(result.current.comment.data?.reactions).toEqual([
      { type: 'like', owner: { _id: 'ada', name: 'Ada Lovelace', picture: '' } },
    ])
    await act(() => result.current.toggle.mutateAsync({ comment: result.current.comment.data!, reactionType: 'like' }))
    expect(result.current.comment.data?.reactions).toEqual([])
    expect(calls).toEqual(['POST', 'DELETE like'])
  })
})

describe('notifications', () => {
  it('marks a notification read at once, and unread again if the request fails', async () => {
    const gate = deferred()
    server.use(
      apiHandler('NotificationList', () => HttpResponse.json([notification('n1'), notification('n2', { read: true })])),
      apiHandler('NotificationMarkRead', async () => {
        await gate.promise
        return HttpResponse.json({ error: { message: 'Nope' } }, { status: 500 })
      }),
    )
    const { wrapper } = setup()
    const { result } = renderHook(
      () => ({ unread: useNotifications(selectUnread), markRead: useMarkNotificationRead() }),
      {
        wrapper,
      },
    )
    await waitFor(() => expect(result.current.unread.data?.map((item) => item._id)).toEqual(['n1']))
    act(() => result.current.markRead.mutate('n1'))
    await waitFor(() => expect(result.current.unread.data).toEqual([])) // before the response
    gate.release()
    await waitFor(() => expect(result.current.markRead.isError).toBe(true))
    expect(result.current.unread.data?.map((item) => item._id)).toEqual(['n1'])
  })

  it('does not fetch while logged out', () => {
    const { wrapper } = setup({ auth: { authToken: null, user: {} } })
    const { result } = renderHook(() => useNotifications(), { wrapper })
    expect(result.current.fetchStatus).toBe('idle')
  })
})

describe('projects and the current user (legacy bridge)', () => {
  it('keeps projects.data and projects.userProjects (Redux) in sync with the queries', async () => {
    let query: URLSearchParams | undefined
    server.use(
      apiHandler('ProjectGet', ({ params }) => HttpResponse.json(project(String(params.projectId)))),
      apiHandler('SearchGet', ({ request }) => {
        query = new URL(request.url).searchParams
        return HttpResponse.json([{ _id: 'p1', name: 'Project p1' }])
      }),
    )
    const { queryClient, store, actions, wrapper } = setup()
    connectLegacyBridge(queryClient, store.dispatch)
    const { result } = renderHook(() => [useProject('p1'), useUserProjects('ada', 'ada')], { wrapper })
    await waitFor(() => expect(result.current.every((item) => item.isSuccess)).toBe(true))
    expect(query?.get('criteria')).toBe('{"private":"all"}') // the current user's list includes private projects
    await waitFor(() =>
      expect(actions.filter((action) => (action.meta as { fromQuery?: boolean } | undefined)?.fromQuery)).toEqual([
        {
          type: 'PROJECTS/GET_PROJECT_FULFILLED',
          payload: { data: project('p1') },
          meta: { projectId: 'p1', size: 'lg', fromQuery: true },
        },
        {
          type: 'PROJECTS/GET_USER_PROJECTS_FULFILLED',
          payload: { data: [{ _id: 'p1', name: 'Project p1' }] },
          meta: { userId: 'ada', fromQuery: true },
        },
      ]),
    )
  })

  it('loads the current user through the cache (auth.user is written by the bridge)', async () => {
    server.use(apiHandler('UserMe', () => HttpResponse.json({ _id: 'ada', name: 'Ada Lovelace' })))
    const { queryClient, store, actions, wrapper } = setup()
    connectLegacyBridge(queryClient, store.dispatch)
    setQueryClient(queryClient)
    try {
      await expect(loadMe()).resolves.toEqual({ user: { _id: 'ada', name: 'Ada Lovelace' }, synced: true })
      await waitFor(() =>
        expect(actions.find((action) => action.type === 'AUTH/LOAD_USER_DATA_FULFILLED')).toMatchObject({
          payload: { data: { _id: 'ada' } },
        }),
      )
      const { result } = renderHook(() => useMe(), { wrapper })
      expect(result.current.data).toEqual({ _id: 'ada', name: 'Ada Lovelace' }) // the same cache entry
    } finally {
      setQueryClient(undefined)
    }
    // Without a QueryClient (Electron main process) the caller writes Redux itself
    await expect(loadMe()).resolves.toMatchObject({ synced: false })
  })
})
