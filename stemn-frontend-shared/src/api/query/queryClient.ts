/**
 * The app's QueryClient defaults.
 *
 * - staleTime 30 s: data shown within 30 s of a fetch is not refetched on mount. Freshness comes from
 *   the websocket (events invalidate the affected keys) and from mutations, not from polling.
 * - refetchOnWindowFocus / refetchOnReconnect stay on: they catch the events missed while the tab was
 *   hidden or offline.
 * - retry: 4xx are not retried (they will fail again); other failures are retried twice.
 * - errors: `onError` receives every failed mutation, and every failed query that has no data yet
 *   (a failing background refetch keeps showing the cached data and does not toast). Each app passes
 *   a handler that dispatches `API/QUERY_REJECTED` / `API/MUTATION_REJECTED`, so the ToastsError
 *   middleware shows the same toasts and modals as for the Redux http actions.
 */
import { MutationCache, QueryCache, QueryClient, type QueryKey } from '@tanstack/react-query'
import type { UnknownAction } from 'redux'
import { isApiError, toPlainError } from '../errors'
import './meta'

export interface IQueryErrorContext {
  kind: 'query' | 'mutation'
  queryKey?: QueryKey
  mutationKey?: QueryKey
}

export interface IStemnQueryClientOptions {
  onError?: (error: unknown, context: IQueryErrorContext) => void
}

export const shouldRetry = (failureCount: number, error: unknown) => {
  if (isApiError(error) && error.status >= 400 && error.status < 500) return false
  return failureCount < 2
}

export const createStemnQueryClient = ({ onError }: IStemnQueryClientOptions = {}) =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.meta?.silent || query.state.data !== undefined) return
        onError?.(error, { kind: 'query', queryKey: query.queryKey })
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.silent) return
        onError?.(error, { kind: 'mutation', mutationKey: mutation.options.mutationKey })
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: shouldRetry,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
      mutations: { retry: false },
    },
  })

/** The Redux action for a failed query/mutation: `_REJECTED` with the error as a plain object, read by ToastsError */
export const queryErrorAction = (
  error: unknown,
  { kind, queryKey, mutationKey }: IQueryErrorContext,
): UnknownAction => ({
  type: kind === 'query' ? 'API/QUERY_REJECTED' : 'API/MUTATION_REJECTED',
  error: true,
  payload: toPlainError(error),
  meta: { queryKey: queryKey || mutationKey },
})
