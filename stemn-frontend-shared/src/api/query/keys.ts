/**
 * Query keys, one factory per domain. Keys are hierarchical so a prefix invalidates a whole group:
 * `queryKeys.threads.all` matches every thread query, `queryKeys.threads.lists()` every thread list,
 * and an object segment matches partially (`threads.projectLists(id)` matches every list of that
 * project, whatever its filters and page).
 *
 * Websocket events, mutations and legacy Redux writes all invalidate through these factories, so a
 * key is never written by hand.
 */
export interface IThreadListParams {
  projectId: string
  page: number
  size: number
  /** The search criteria (group, labels, name, complete, users) */
  criteria: Record<string, unknown>
}

export const queryKeys = {
  me: ['me'] as const,
  projects: {
    all: ['projects'] as const,
    detail: (projectId: string) => ['projects', 'detail', projectId] as const,
    userLists: () => ['projects', 'user'] as const,
    /** `includePrivate`: the list of the current user (private projects included) */
    byUser: (userId: string, includePrivate?: boolean) =>
      includePrivate === undefined
        ? (['projects', 'user', userId] as const)
        : (['projects', 'user', userId, { includePrivate }] as const),
  },
  threads: {
    all: ['threads'] as const,
    detail: (threadId: string) => ['threads', 'detail', threadId] as const,
    lists: () => ['threads', 'list'] as const,
    projectLists: (projectId: string) => ['threads', 'list', { projectId }] as const,
    list: (params: IThreadListParams) => ['threads', 'list', params] as const,
  },
  comments: {
    all: ['comments'] as const,
    detail: (commentId: string) => ['comments', 'detail', commentId] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: () => ['notifications', 'list'] as const,
  },
}
