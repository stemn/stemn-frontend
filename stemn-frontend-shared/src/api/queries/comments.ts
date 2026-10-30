/**
 * Comments: get (batched), create, update, delete, reactions.
 *
 * Comments are fully on TanStack Query (the Redux `comments` slice is gone). The thread timeline
 * (SyncTimeline, still Redux) lists comment events by id: creating and deleting a comment add and
 * remove that event, as the Redux actions did.
 */
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useStore } from 'react-redux'
import { addEvent, deleteEvent } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions'
import { createBatcher } from '../batch'
import { api, unwrap } from '../client'
import type { IComment, IReaction } from '../models'
import { queryKeys } from '../query/keys'

const commentBatcher = createBatcher<IComment>({
  fetchMany: (ids) => unwrap(api.GET('/api/v1/comments', { params: { query: { ids } } })),
})

export const commentQueries = {
  /** Batched with the other comments requested within 20 ms (GET /comments?ids[]=...): a timeline loads them all at once */
  detail: (commentId: string) =>
    queryOptions({
      queryKey: queryKeys.comments.detail(commentId),
      queryFn: () => commentBatcher.load(commentId),
    }),
}

export const useComment = (commentId: string | undefined) =>
  useQuery({ ...commentQueries.detail(commentId || ''), enabled: Boolean(commentId) })

interface ICurrentUser {
  _id?: string
  name?: string
  picture?: string
}

interface ICommentsLegacyState {
  auth: { user: ICurrentUser }
  syncTimeline?: Record<string, { data?: { _id: string; data?: { comment?: string } }[] } | undefined>
}

const commentThreadId = (comment: Pick<IComment, 'thread'>) =>
  typeof comment.thread === 'string' ? comment.thread : comment.thread._id

export interface ICreateCommentInput {
  threadId: string
  body: string
  /** The Redux timeline that lists this thread's events (adds the comment event to it) */
  timelineCacheKey?: string
}

export const useCreateComment = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  return useMutation({
    mutationKey: ['comments', 'create'],
    mutationFn: ({ threadId, body }: ICreateCommentInput) =>
      unwrap(
        api.POST('/api/v1/threads/{threadId}/comments', {
          params: { path: { threadId } },
          body: { thread: threadId, body },
        }),
      ),
    onSuccess: (comment, { threadId, timelineCacheKey }) => {
      queryClient.setQueryData(queryKeys.comments.detail(comment._id), comment)
      if (timelineCacheKey) {
        const { name, _id, picture } = (store.getState() as ICommentsLegacyState).auth.user
        store.dispatch(
          addEvent({
            cacheKey: timelineCacheKey,
            event: {
              event: 'comment',
              timestamp: comment.timestamp,
              user: { name, _id, picture },
              data: { comment: comment._id },
            },
          }),
        )
      }
      // numComments
      return queryClient.invalidateQueries({ queryKey: queryKeys.threads.detail(threadId) })
    },
  })
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['comments', 'update'],
    mutationFn: ({ comment, body }: { comment: IComment; body: string }) =>
      unwrap(
        api.PUT('/api/v1/comments/{commentId}', {
          params: { path: { commentId: comment._id } },
          // Only the edited field: the API $sets every field it gets (the cached comment has populated
          // references, which must not be written back). `thread` (the id, unchanged) is sent because
          // the API addresses the THREAD/COMMENT_UPDATED event to the room of the body's thread.
          body: { _id: comment._id, body, thread: commentThreadId(comment) },
        }),
      ),
    onSuccess: (updated, { comment }) =>
      // The response has the owner populated but the thread as an id: keep the cached thread
      queryClient.setQueryData<IComment>(queryKeys.comments.detail(comment._id), {
        ...updated,
        thread: comment.thread,
      }),
  })
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  return useMutation({
    mutationKey: ['comments', 'delete'],
    mutationFn: ({ comment }: { comment: IComment; timelineCacheKey?: string }) =>
      unwrap(api.DELETE('/api/v1/comments/{commentId}', { params: { path: { commentId: comment._id } } })),
    onSuccess: (_empty, { comment, timelineCacheKey }) => {
      queryClient.removeQueries({ queryKey: queryKeys.comments.detail(comment._id) })
      const state = store.getState() as ICommentsLegacyState
      const timeline = timelineCacheKey ? state.syncTimeline?.[timelineCacheKey]?.data : undefined
      const event = timeline && timeline.find((item) => item.data && item.data.comment === comment._id)
      if (timelineCacheKey && event) store.dispatch(deleteEvent({ cacheKey: timelineCacheKey, eventId: event._id }))
      return queryClient.invalidateQueries({ queryKey: queryKeys.threads.detail(commentThreadId(comment)) })
    },
  })
}

/** Adds the reaction, or removes it if the current user already made it (optimistic) */
export const useToggleReaction = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  return useMutation({
    mutationKey: ['comments', 'reaction'],
    mutationFn: async ({ comment, reactionType }: { comment: IComment; reactionType: string }) => {
      const { _id: userId } = (store.getState() as ICommentsLegacyState).auth.user
      const exists = comment.reactions.some(
        (reaction) => reaction.owner._id === userId && reaction.type === reactionType,
      )
      if (exists) {
        await unwrap(
          api.DELETE('/api/v1/comments/{commentId}/reaction/{reaction}', {
            params: { path: { commentId: comment._id, reaction: reactionType } },
          }),
        )
        return
      }
      await unwrap(
        api.POST('/api/v1/comments/{commentId}/reaction', {
          params: { path: { commentId: comment._id } },
          body: { type: reactionType },
        }),
      )
    },
    onMutate: async ({ comment, reactionType }) => {
      const queryKey = queryKeys.comments.detail(comment._id)
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<IComment>(queryKey)
      const user = (store.getState() as ICommentsLegacyState).auth.user
      const reactions = (previous || comment).reactions
      const mine = (reaction: IReaction) => reaction.owner._id === user._id && reaction.type === reactionType
      const next = reactions.some(mine)
        ? reactions.filter((reaction) => !mine(reaction))
        : [...reactions, { type: reactionType, owner: { _id: user._id || '', name: user.name, picture: user.picture } }]
      queryClient.setQueryData<IComment>(queryKey, { ...(previous || comment), reactions: next })
      return { previous }
    },
    onError: (_error, { comment }, context) => {
      if (context?.previous) queryClient.setQueryData(queryKeys.comments.detail(comment._id), context.previous)
    },
  })
}
