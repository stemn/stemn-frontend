/**
 * The generated API client and the TanStack Query layer (docs/API-CLIENT.md).
 *
 *   import { api, unwrap } from 'stemn-shared/api'                   typed fetch client
 *   import { useThread, useUpdateThread } from 'stemn-shared/api'    query hooks per domain
 *   import type { IThread, ThreadGetResponse } from 'stemn-shared/api'
 */
export { api, createApiClient, setApiTokenGetter, unwrap, type ApiClient } from './client'
export { ApiError, isApiError, toApiError, toPlainError } from './errors'
export { createBatcher } from './batch'
export * from './models'
export type * from './operations.gen'
export type { ApiPathParams, ApiQuery, ApiRequestBody, ApiResponse, OperationId, Schemas } from './types'

export { queryKeys, type IThreadListParams } from './query/keys'
export { createStemnQueryClient, queryErrorAction } from './query/queryClient'
export { createQueryMiddleware, invalidateQueries, INVALIDATE_QUERIES } from './query/invalidation'
export { connectLegacyBridge } from './query/legacyBridge'
export { getQueryClient, isQueryObserved, setQueryClient } from './query/registry'
export { toLegacyEntity, type ILegacyEntity } from './query/legacyShape'
export { legacyInvalidations } from './query/legacyInvalidations'

export * from './queries/me'
export * from './queries/projects'
export * from './queries/threads'
export * from './queries/comments'
export * from './queries/notifications'
