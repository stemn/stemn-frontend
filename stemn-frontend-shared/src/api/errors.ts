/**
 * Error normalisation: every failure of the API client (HTTP error, item-level error of a list
 * route, network failure) becomes an `ApiError`.
 *
 * `ApiError` carries the StemnError fields (`status`, `type`, `code`, `message`, `data`) and, like an
 * axios error, `response: { status, data }` with the body the server sent. That is the shape the rest
 * of the app reads: the ToastsError middleware (`payload.response.data.error`), the error modals
 * (`errorMap[type]`) and the legacy callers that check `error.response.status`.
 */

/** The `error` object of a StemnError response (`{ error: { code, type, message, data } }`) */
export interface IStemnErrorBody {
  code?: number
  type?: string
  message?: string
  data?: unknown
}

export interface IApiErrorInit {
  status: number
  message: string
  type?: string
  code?: number
  data?: unknown
  /** The body as the server sent it */
  body?: unknown
  method?: string
  url?: string
  cause?: unknown
}

export class ApiError extends Error {
  override readonly name = 'ApiError'
  readonly isApiError = true
  /** HTTP status; 0 when the request never got a response (network error) */
  readonly status: number
  /** StemnError type, e.g. ENTITY_NOT_FOUND, VALIDATION_FAILED, UNAUTHORIZED */
  readonly type?: string
  readonly code?: number
  readonly data?: unknown
  readonly method?: string
  readonly url?: string
  /** axios-compatible response, read by the ToastsError middleware and legacy callers */
  readonly response?: { status: number; data: unknown }

  constructor({ status, message, type, code, data, body, method, url, cause }: IApiErrorInit) {
    super(message, cause === undefined ? undefined : { cause })
    this.status = status
    this.type = type
    this.code = code
    this.data = data
    this.method = method
    this.url = url
    this.response = status ? { status, data: body } : undefined
  }
}

export const isApiError = (error: unknown): error is ApiError =>
  error instanceof ApiError || Boolean(error && typeof error === 'object' && 'isApiError' in error)

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

/**
 * The API sends errors in three shapes (see ToastsError.middleware):
 *   1. `{ error: { message, type, data, code } }` (StemnError, the normal case)
 *   2. `{ error: 'Some error string' }` (also the item-level errors of the `?ids[]=` list routes)
 *   3. `{ message: 'Some other error message' }`
 */
export const parseErrorBody = (body: unknown): IStemnErrorBody => {
  if (!isRecord(body)) return typeof body === 'string' && body ? { message: body } : {}
  const { error } = body
  if (isRecord(error)) {
    return {
      code: typeof error.code === 'number' ? error.code : undefined,
      type: typeof error.type === 'string' ? error.type : undefined,
      message: typeof error.message === 'string' ? error.message : undefined,
      data: error.data,
    }
  }
  if (typeof error === 'string') return { message: error }
  if (typeof body.message === 'string') return { message: body.message }
  return {}
}

/** An HTTP error response as an ApiError */
export const toApiError = ({
  status,
  body,
  method,
  url,
}: {
  status: number
  body: unknown
  method?: string
  url?: string
}): ApiError => {
  const { code, type, message, data } = parseErrorBody(body)
  return new ApiError({
    status,
    code,
    type,
    data,
    body,
    method,
    url,
    message: message || `Request failed with status code ${status}`,
  })
}

/** A request that got no response (offline, DNS, CORS, server down) */
export const toNetworkError = (cause: unknown, { method, url }: { method?: string; url?: string } = {}): ApiError =>
  new ApiError({
    status: 0,
    type: 'NETWORK_ERROR',
    message: cause instanceof Error && cause.message ? `Network error: ${cause.message}` : 'Network error',
    method,
    url,
    cause,
  })

/** Aborted requests (query cancellation) keep their AbortError so TanStack Query recognises them */
export const isAbortError = (error: unknown) =>
  Boolean(error && typeof error === 'object' && 'name' in error && error.name === 'AbortError')

/**
 * A plain-object copy of an error for Redux actions: serialisable (Electron IPC, the Redux logger)
 * and still in the shape the ToastsError middleware reads (`response.data.error`).
 */
export const toPlainError = (error: unknown) => {
  if (isApiError(error)) {
    const { name, message, status, type, code, data, method, url, response } = error
    return { name, message, isApiError: true, status, type, code, data, method, url, response }
  }
  if (error instanceof Error) return { name: error.name, message: error.message }
  return { name: 'Error', message: String(error) }
}
