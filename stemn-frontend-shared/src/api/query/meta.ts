/**
 * Typed `meta` for queries and mutations (TanStack Query's Register interface).
 *
 * - `legacySync`: while a domain still has Redux readers, the query writes its data into the legacy
 *   slice through this action creator (see legacyBridge.ts). Use the `legacySync()` helper to type it.
 * - `silent`: failures of this query/mutation are not shown as error toasts.
 */
import type { UnknownAction } from 'redux'

export type LegacySync = (data: unknown) => UnknownAction | undefined

export interface IStemnQueryMeta extends Record<string, unknown> {
  legacySync?: LegacySync
  silent?: boolean
}

export interface IStemnMutationMeta extends Record<string, unknown> {
  silent?: boolean
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: IStemnQueryMeta
    mutationMeta: IStemnMutationMeta
  }
}

/** Types a legacy sync for the query's data (meta is untyped per query) */
// A function declaration, not a generic arrow: the webpack fallback's Babel parses `<T>(` in .ts as JSX
export function legacySync<Data>(toAction: (data: Data) => UnknownAction | undefined): LegacySync {
  return toAction as LegacySync
}
