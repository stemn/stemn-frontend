/**
 * Redux <-> TanStack Query coexistence, Redux side.
 *
 * `invalidateQueries(...keys)` is a plain Redux action, so code that only has a Redux store can
 * invalidate queries: the websocket event map (on the website and in the Electron main process,
 * whose actions are replayed in every renderer window), legacy thunks, the desktop FunctionLibrary.
 * The middleware created by `createQueryMiddleware` (one per store that has a QueryClient) does:
 *
 *  1. `API/INVALIDATE_QUERIES`  -> `queryClient.invalidateQueries` for each key;
 *  2. legacy writes             -> invalidate the keys they make stale (`legacyInvalidations`, e.g. the
 *                                  desktop board saving a thread with `THREADS/UPDATE_TASK_FULFILLED`);
 *  3. auth token changes        -> log out clears the cache, log in / token refresh refetches it all.
 *
 * Actions the query bridge itself dispatches carry `meta.fromQuery` and are not mapped (no loops).
 */
import type { QueryClient, QueryKey } from '@tanstack/react-query'
import type { Middleware, UnknownAction } from 'redux'

export const INVALIDATE_QUERIES = 'API/INVALIDATE_QUERIES'

export interface IInvalidateQueriesAction {
  type: typeof INVALIDATE_QUERIES
  payload: { queryKeys: QueryKey[] }
}

export const invalidateQueries = (...queryKeys: QueryKey[]): IInvalidateQueriesAction => ({
  type: INVALIDATE_QUERIES,
  payload: { queryKeys },
})

/** Query keys a legacy Redux action makes stale, by action type */
export type LegacyInvalidations = Record<string, (action: ILegacyAction) => QueryKey[]>

export interface ILegacyAction extends UnknownAction {
  payload?: { data?: unknown } & Record<string, unknown>
  meta?: Record<string, unknown>
}

export interface IQueryMiddlewareOptions {
  legacyInvalidations?: LegacyInvalidations
  /** Reads the auth token from the store state */
  getToken?: (state: unknown) => unknown
}

const isAction = (action: unknown): action is ILegacyAction =>
  Boolean(action) && typeof action === 'object' && typeof (action as UnknownAction).type === 'string'

const defaultGetToken = (state: unknown) => {
  const auth = state && typeof state === 'object' && 'auth' in state ? state.auth : undefined
  return auth && typeof auth === 'object' && 'authToken' in auth ? auth.authToken : undefined
}

export const createQueryMiddleware =
  (
    queryClient: QueryClient,
    { legacyInvalidations = {}, getToken = defaultGetToken }: IQueryMiddlewareOptions = {},
  ): Middleware =>
  (store) =>
  (next) =>
  (action) => {
    const tokenBefore = getToken(store.getState())
    const result = next(action)
    if (!isAction(action)) return result

    if (action.type === INVALIDATE_QUERIES) {
      const { queryKeys } = (action as unknown as IInvalidateQueriesAction).payload
      queryKeys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }))
    } else if (!action.meta?.fromQuery && legacyInvalidations[action.type]) {
      legacyInvalidations[action.type](action).forEach((queryKey) => queryClient.invalidateQueries({ queryKey }))
    }

    const tokenAfter = getToken(store.getState())
    if (tokenAfter !== tokenBefore) {
      if (tokenAfter) queryClient.invalidateQueries()
      else queryClient.clear()
    }
    return result
  }
