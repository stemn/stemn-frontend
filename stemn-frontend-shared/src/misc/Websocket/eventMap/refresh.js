import { invalidateQueries } from 'stemn-shared/api/query/invalidation'
import { isQueryObserved } from 'stemn-shared/api/query/registry'

/**
 * Refreshes the data a websocket event made stale, wherever it lives during the Redux -> TanStack
 * Query migration (docs/API-CLIENT.md, "Realtime"):
 *  - the query keys are invalidated (`API/INVALIDATE_QUERIES`: handled by the query middleware of
 *    this store; in the Electron main process the action is replayed in every renderer window);
 *  - `legacy` (a function dispatching the Redux refetch) runs only when no mounted component in
 *    this JS context observes those queries, i.e. when Redux readers may still need it. In the
 *    Electron main process there is no QueryClient, so it always runs there.
 */
export const refresh = (store, queryKeys, legacy) => {
  store.dispatch(invalidateQueries(...queryKeys))
  if (legacy && !isQueryObserved(queryKeys)) {
    return legacy()
  }
  return undefined
}
