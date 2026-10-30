/**
 * The typed API client: openapi-fetch over the generated `paths` (schema.gen.ts).
 *
 *   const thread = await unwrap(api.GET('/api/v1/threads/{threadId}', { params: { path: { threadId } } }))
 *
 * - Paths, parameters, bodies and responses are typed from the OpenAPI document; a wrong path or a
 *   missing parameter is a type error.
 * - Query strings use the axios 0.x format the API expects (`ids[]=1&ids[]=2`, objects as JSON), the
 *   same serializer as the axios defaults (`legacyParamsSerializer`).
 * - The auth header comes from the app's auth state through `setApiTokenGetter` (called by each app's
 *   initHttp next to the axios interceptor); a request that sets `Authorization` itself keeps it.
 * - `unwrap` throws an `ApiError` (errors.ts) for HTTP errors; network errors are `ApiError`s with
 *   status 0. openapi-fetch itself never throws for HTTP errors.
 */
import createClient, { type Client, type Middleware } from 'openapi-fetch'
import { legacyParamsSerializer } from 'stemn-shared/utils/legacyParamsSerializer'
import { isAbortError, toApiError, toNetworkError } from './errors'
import type { paths } from './schema.gen'

export type ApiClient = Client<paths>
export type TokenGetter = () => string | null | undefined

export interface IApiClientOptions {
  /** API origin, e.g. http://localhost:3000 (the document's paths start with /api/v1) */
  baseUrl: string
  getToken?: TokenGetter
  /** Defaults to the global fetch, looked up on every request (so test interceptors apply) */
  fetch?: typeof globalThis.fetch
}

/** Adds `Authorization: bearer <token>` when there is a token and the request has no Authorization */
export const authMiddleware = (getToken: TokenGetter): Middleware => ({
  onRequest({ request }) {
    const token = getToken()
    if (token && !request.headers.has('Authorization')) {
      request.headers.set('Authorization', `bearer ${token}`)
    }
    return request
  },
})

/** Network failures become ApiErrors (status 0); aborts stay AbortErrors */
export const networkErrorMiddleware: Middleware = {
  onError({ error, request }) {
    if (isAbortError(error)) return error instanceof Error ? error : undefined
    return toNetworkError(error, { method: request.method, url: request.url })
  },
}

export const createApiClient = ({ baseUrl, getToken = () => undefined, fetch }: IApiClientOptions): ApiClient => {
  const client = createClient<paths>({
    baseUrl,
    querySerializer: (query) => legacyParamsSerializer(query),
    fetch: (input) => (fetch || globalThis.fetch)(input),
  })
  client.use(authMiddleware(getToken), networkErrorMiddleware)
  return client
}

type ApiResult<Data> = { data?: Data; error?: unknown; response: Response }

/** Resolves with the response body, or throws an ApiError when the response is not 2xx */
// A function declaration, not a generic arrow: the webpack fallback's Babel parses `<T>(` in .ts as JSX
export async function unwrap<Data>(request: Promise<ApiResult<Data>>): Promise<Data> {
  const { data, error, response } = await request
  if (!response.ok) {
    throw toApiError({ status: response.status, body: error, url: response.url })
  }
  return data as Data // openapi-fetch types `data` as possibly undefined; it is the body of a 2xx response
}

let tokenGetter: TokenGetter = () => undefined

/** Called by each app at start-up with a function returning the current auth token */
export const setApiTokenGetter = (getToken: TokenGetter) => {
  tokenGetter = getToken
}

/** The app's client: GLOBAL_ENV.API_SERVER and the token from setApiTokenGetter */
export const api: ApiClient = createApiClient({ baseUrl: GLOBAL_ENV.API_SERVER, getToken: () => tokenGetter() })
