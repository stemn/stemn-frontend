/**
 * Type helpers over the generated schema: the request and response types of any operation by its
 * operationId. operations.gen.ts uses them to export `<OperationId>Response`, `Body`, `Query` and `Path`
 * aliases for every route, e.g. `ThreadGetResponse`, `ThreadUpdateBody`, `SearchGetQuery`.
 */
import type { components, operations, paths } from './schema.gen'

export type { components, operations, paths }

/** Every component schema of the document (`Schemas['IThread']`, ...) */
export type Schemas = components['schemas']

export type OperationId = keyof operations

type JsonContent<T> = T extends { content: { 'application/json': infer Content } } ? Content : undefined

/** The JSON body of the operation's 200 response (`undefined` for an empty response) */
export type ApiResponse<Id extends OperationId> = operations[Id]['responses'] extends { 200: infer Ok }
  ? JsonContent<Ok>
  : undefined

/** The JSON request body of the operation */
export type ApiRequestBody<Id extends OperationId> = operations[Id] extends { requestBody: infer Body }
  ? JsonContent<NonNullable<Body>>
  : never

/** The query parameters of the operation */
export type ApiQuery<Id extends OperationId> = NonNullable<operations[Id]['parameters']['query']>

/** The path parameters of the operation */
export type ApiPathParams<Id extends OperationId> = NonNullable<operations[Id]['parameters']['path']>
