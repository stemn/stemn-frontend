/**
 * react-router v3 style query helpers.
 * v3 locations carried a parsed `query` object; modern react-router only has `search`.
 */

export type Query = Record<string, any>

export interface LegacyLocationDescriptor {
  pathname?: string,
  query?: Query,
  search?: string,
  hash?: string,
  state?: any,
}

export interface LegacyLocation {
  pathname: string,
  search: string,
  hash: string,
  state: any,
  key?: string,
  action?: string,
  query: Query,
}

/** Parse `?a=1&b=2&b=3` into `{ a: '1', b: ['2', '3'] }` (same shape as react-router v3) */
export const parseQuery = (search: string = ''): Query => {
  const query: Query = {}
  new URLSearchParams(search).forEach((value, key) => {
    if (key in query) {
      query[key] = ([] as string[]).concat(query[key], value)
    } else {
      query[key] = value
    }
  })
  return query
}

/** Stringify a query object. undefined/null values are dropped, arrays are repeated keys. */
export const stringifyQuery = (query?: Query): string => {
  if (!query) {
    return ''
  }
  const params = new URLSearchParams()
  Object.keys(query).forEach((key) => {
    const value = query[key]
    if (value === undefined || value === null) {
      return
    }
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, String(item)))
    } else {
      params.append(key, String(value))
    }
  })
  const search = params.toString()
  return search ? `?${search}` : ''
}

/**
 * Convert a v3 location descriptor (string or `{ pathname, query, state }`)
 * into the `{ to, state }` pair understood by react-router's navigate()/<Link>.
 */
export const toRouterPath = (location: string | LegacyLocationDescriptor) => {
  if (typeof location === 'string') {
    return { to: location, state: undefined }
  }
  const { pathname, query, search, hash, state } = location || {}
  const querySearch = query ? stringifyQuery(query) : ''
  return {
    to: {
      pathname,
      search: querySearch || search || '',
      hash: hash || '',
    },
    state,
  }
}

/** Add the v3 `query` (and optionally `action`) to a react-router location */
export const toLegacyLocation = (location: any, action?: string): LegacyLocation => ({
  pathname: location.pathname,
  search: location.search || '',
  hash: location.hash || '',
  state: location.state === undefined ? null : location.state,
  key: location.key,
  action,
  query: parseQuery(location.search),
})
