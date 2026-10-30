/**
 * Presentational components written for Redux receive entities as `{ data, loading, error }`
 * (the legacy slice entry). `toLegacyEntity` gives a query result that shape, so a container can move
 * to a query hook without touching the component it renders.
 */
import type { UseQueryResult } from '@tanstack/react-query'

export interface ILegacyEntity<Data> {
  data?: Data
  loading: boolean
  error?: unknown
}

// A function declaration, not a generic arrow: the webpack fallback's Babel parses `<T>(` in .ts as JSX
export function toLegacyEntity<Data>(
  query: Pick<UseQueryResult<Data>, 'data' | 'isFetching' | 'error'>,
): ILegacyEntity<Data> {
  return {
    data: query.data,
    loading: query.isFetching,
    error: query.error || undefined,
  }
}
