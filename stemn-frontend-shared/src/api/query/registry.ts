/**
 * The QueryClient of this JS context (the website tab, or one desktop renderer window), for code that
 * runs outside React: thunks (`loadUserData`) and the websocket event map. The Electron main process
 * has no QueryClient: there `getQueryClient()` is undefined and that code falls back to Redux.
 */
import type { QueryClient, QueryKey } from '@tanstack/react-query'

let current: QueryClient | undefined

export const setQueryClient = (queryClient: QueryClient | undefined) => {
  current = queryClient
}

export const getQueryClient = () => current

/** True when a mounted component observes a query matching one of the keys (in this JS context) */
export const isQueryObserved = (queryKeys: readonly QueryKey[]) => {
  if (!current) return false
  const cache = current.getQueryCache()
  return queryKeys.some((queryKey) => cache.findAll({ queryKey }).some((query) => query.getObserversCount() > 0))
}
