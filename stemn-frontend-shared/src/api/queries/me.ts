/**
 * The current user (`GET /api/v1/me`).
 *
 * Redux keeps `auth.user` as a mirror of this query for the ~50 legacy readers (the auth slice owns the
 * session: token, login forms). `loadUserData` loads it through this query, and the query's
 * legacySync writes every new version into `auth.user` (AUTH/LOAD_USER_DATA_FULFILLED).
 */
import { queryOptions, useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { api, unwrap } from '../client'
import { legacySync } from '../query/meta'
import { queryKeys } from '../query/keys'
import { getQueryClient } from '../query/registry'
import type { IMe } from '../models'

interface IAuthState {
  auth: { authToken?: string | null }
}

const fetchMe = (signal?: AbortSignal) => unwrap(api.GET('/api/v1/me', { signal }))

export const meQueries = {
  me: () =>
    queryOptions({
      queryKey: queryKeys.me,
      queryFn: ({ signal }) => fetchMe(signal),
      meta: {
        legacySync: legacySync<IMe>((user) => ({ type: 'AUTH/LOAD_USER_DATA_FULFILLED', payload: { data: user } })),
      },
    }),
}

/** The current user; disabled while logged out */
export const useMe = () => {
  const authToken = useSelector((state: IAuthState) => state.auth.authToken)
  return useQuery({ ...meQueries.me(), enabled: Boolean(authToken) })
}

/**
 * Loads the current user for non-React code. With a QueryClient (website, desktop renderers) it goes
 * through the cache, whose legacy bridge then updates `auth.user`; `synced` says so. In the Electron
 * main process there is no QueryClient: the caller writes the result to Redux itself.
 */
export const loadMe = async (): Promise<{ user: IMe; synced: boolean }> => {
  const queryClient = getQueryClient()
  if (!queryClient) return { user: await fetchMe(), synced: false }
  const user = await queryClient.fetchQuery({ ...meQueries.me(), staleTime: 0 })
  return { user, synced: true }
}
