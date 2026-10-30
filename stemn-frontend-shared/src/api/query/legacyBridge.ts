/**
 * Redux <-> TanStack Query coexistence, Query side.
 *
 * A query whose domain still has Redux readers declares `meta.legacySync` (see meta.ts). Each time
 * its data changes (fetch, refetch, setQueryData), the action it returns is dispatched, so the legacy
 * slice holds the same data as the cache: e.g. the project query writes `projects.data[id]` for the
 * ~25 project page containers that still read it. Unchanged refetches (TanStack Query keeps the same
 * reference when the data is deep-equal) dispatch nothing, so model-bound forms are not reset.
 */
import type { Query, QueryClient } from '@tanstack/react-query'
import type { Dispatch, UnknownAction } from 'redux'

export const connectLegacyBridge = (queryClient: QueryClient, dispatch: Dispatch<UnknownAction>) => {
  const synced = new WeakMap<Query, unknown>()
  return queryClient.getQueryCache().subscribe((event) => {
    if (event.type !== 'updated' || event.action.type !== 'success') return
    const { query } = event
    const sync = query.meta?.legacySync
    const { data } = query.state
    if (!sync || data === undefined || synced.get(query) === data) return
    synced.set(query, data)
    const action = sync(data)
    if (action) dispatch({ ...action, meta: { ...(action.meta as object), fromQuery: true } })
  })
}
