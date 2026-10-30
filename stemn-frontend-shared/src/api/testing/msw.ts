/**
 * Test helpers: MSW handlers for the OpenAPI routes, addressed by operationId, and a render wrapper
 * with a fresh QueryClient and a Redux store. Only imported by tests.
 *
 *   server.use(apiHandler('ThreadGet', ({ params }) => HttpResponse.json(thread)))
 */
import { http, type HttpResponseResolver } from 'msw'
import { apiOperations, type ApiOperations } from '../operations.gen'
import type { OperationId } from '../types'

/** The API origin the client uses in the tests (GLOBAL_ENV.API_SERVER in vitest.config.mts) */
export const API_ORIGIN = GLOBAL_ENV.API_SERVER

/** `/api/v1/threads/{threadId}` -> `http://localhost:3000/api/v1/threads/:threadId` */
export const mswUrl = (path: string) => `${API_ORIGIN}${path.replace(/\{(\w+)\}/g, ':$1')}`

/** An MSW handler for one operation of the document */
export const apiHandler = <Id extends OperationId & keyof ApiOperations>(
  operationId: Id,
  resolver: HttpResponseResolver,
) => {
  const { method, path } = apiOperations[operationId]
  return http[method](mswUrl(path), resolver)
}
