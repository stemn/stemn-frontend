import { getAuthToken } from 'stemn-frontend-desktop/app/main/storeRef.js'

/** What Rust needs to download from the API like the main-process axios instance (initHttp) */
export const apiContext = () => ({ apiServer: GLOBAL_ENV.API_SERVER, token: getAuthToken() || null })

/** Rust command errors are strings: make them Errors like the Node APIs threw */
export const toError = (error: unknown, extra: Record<string, unknown> = {}) =>
  Object.assign(error instanceof Error ? error : new Error(String(error)), extra)
