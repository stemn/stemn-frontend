/**
 * Notifications: the current user's list (polled every minute while logged in) and mark-as-read.
 * Fully on TanStack Query: the Redux `notifications` slice is gone.
 */
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { api, unwrap } from '../client'
import type { INotification } from '../models'
import { queryKeys } from '../query/keys'

export const NOTIFICATIONS_POLL_INTERVAL = 60_000

export const notificationQueries = {
  list: () =>
    queryOptions({
      queryKey: queryKeys.notifications.list(),
      queryFn: ({ signal }) => unwrap(api.GET('/api/v1/notifications', { signal })),
    }),
}

interface IAuthState {
  auth: { authToken?: string | null }
}

// A function declaration, not a generic arrow: the webpack fallback's Babel parses `<T>(` in .ts as JSX
export function useNotifications<Selected = INotification[]>(select?: (notifications: INotification[]) => Selected) {
  const authToken = useSelector((state: IAuthState) => state.auth.authToken)
  return useQuery({
    ...notificationQueries.list(),
    select,
    enabled: Boolean(authToken),
    refetchInterval: NOTIFICATIONS_POLL_INTERVAL,
  })
}

export const selectUnread = (notifications: INotification[]) =>
  notifications.filter((notification) => !notification.read)

/** Marks a notification as read at once, and back to unread if the request fails */
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.notifications.list()
  const setRead = (notificationId: string, read: boolean) =>
    queryClient.setQueryData<INotification[]>(queryKey, (notifications) =>
      notifications?.map((notification) =>
        notification._id === notificationId ? { ...notification, read } : notification,
      ),
    )
  return useMutation({
    mutationKey: ['notifications', 'markRead'],
    mutationFn: (notificationId: string) =>
      unwrap(api.PUT('/api/v1/notifications/{notificationId}', { params: { path: { notificationId } } })),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey })
      setRead(notificationId, true)
    },
    onError: (_error, notificationId) => setRead(notificationId, false),
  })
}
