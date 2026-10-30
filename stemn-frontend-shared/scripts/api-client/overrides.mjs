/**
 * Corrections applied to the backend's OpenAPI document before the client types are generated.
 *
 * The document is generated from `@stemn/types` (stemn-backend ADR-018). A few of those types do not
 * match what the API really sends, and the generated client would then be typed wrongly. Each entry
 * below fixes one such mismatch, says why, and is a backend follow-up: once `@stemn/types` is fixed,
 * the entry no longer changes anything, the generator prints a warning, and the entry is deleted.
 *
 * Only the routes the frontend calls through the generated client are corrected (see
 * docs/API-CLIENT.md, "Spec overrides"). The snapshot (`src/api/openapi.json`) stays the document
 * exactly as the backend serves it.
 */

const ref = (name) => ({ $ref: `#/components/schemas/${name}` })
const json = (schema) => ({ 'application/json': { schema } })
const ok = (schema) => ({ description: 'OK', content: json(schema) })

const operation = (spec, operationId) => {
  for (const methods of Object.values(spec.paths)) {
    for (const op of Object.values(methods)) {
      if (op && op.operationId === operationId) return op
    }
  }
  throw new Error(`overrides: operation ${operationId} is not in the document`)
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

/** Sets a value and reports whether it changed anything */
const assign = (target, key, value) => {
  if (same(target[key], value)) return false
  target[key] = value
  return true
}

const setResponse = (spec, operationId, schema) => {
  const op = operation(spec, operationId)
  return assign(op.responses, '200', ok(schema))
}

const setRequestBody = (spec, operationId, schema) => {
  const op = operation(spec, operationId)
  return assign(op, 'requestBody', { required: true, content: json(schema) })
}

const setQueryParameter = (spec, operationId, name, schema, required = false) => {
  const op = operation(spec, operationId)
  op.parameters = op.parameters || []
  const index = op.parameters.findIndex((param) => param.in === 'query' && param.name === name)
  const param = { in: 'query', name, required, schema }
  if (index === -1) {
    op.parameters.push(param)
    return true
  }
  return assign(op.parameters, index, param)
}

const addComponent = (spec, name, schema) => assign(spec.components.schemas, name, schema)

/** Adds optional properties to a component */
const addProperties = (spec, name, properties) => {
  const schema = spec.components.schemas[name]
  if (!schema) throw new Error(`overrides: component ${name} is not in the document`)
  return Object.entries(properties)
    .map(([key, value]) => assign((schema.properties = schema.properties || {}), key, value))
    .some(Boolean)
}

const string = { type: 'string' }
const strings = { type: 'array', items: string }

// The entity afterware populates references with these summaries (`{ _id, name, ..., entityType }`)
const entitySummary = {
  type: 'object',
  properties: {
    _id: string,
    name: string,
    stub: string,
    picture: string,
    blurb: string,
    entityType: string,
  },
  required: ['_id', 'name', 'entityType'],
}

/** @type {{ id: string, reason: string, apply: (spec: any) => boolean }[]} */
export const overrides = [
  {
    id: 'entity-summary',
    reason: 'populated references (thread owner/users/project, comment owner/thread) have no component',
    apply: (spec) => addComponent(spec, 'IEntitySummary', entitySummary),
  },
  {
    id: 'thread-populated',
    reason:
      'IThread declares owner/users/project as ids, but every thread route responds with them populated ' +
      '(IThreadClientTransformed, like INotificationClientTransformed)',
    apply: (spec) =>
      [
        // IThread with the populated references (a copy, not allOf: `string & IEntitySummary` is never)
        addComponent(spec, 'IThreadClientTransformed', {
          ...spec.components.schemas.IThread,
          properties: {
            ...spec.components.schemas.IThread.properties,
            owner: ref('IEntitySummary'),
            users: { type: 'array', items: ref('IEntitySummary') },
            project: ref('IEntitySummary'),
          },
        }),
        setResponse(spec, 'ThreadGet', ref('IThreadClientTransformed')),
        setResponse(spec, 'ThreadList', { type: 'array', items: ref('IThreadClientTransformed') }),
        setResponse(spec, 'ThreadUpdate', ref('IThreadClientTransformed')),
      ].some(Boolean),
  },
  {
    id: 'thread-create-response',
    reason: 'IProjectThreadCreateResponse is IFile, the route responds with the new (populated) thread',
    apply: (spec) => setResponse(spec, 'ProjectThreadCreate', ref('IThreadClientTransformed')),
  },
  {
    id: 'comment-component',
    reason:
      'there is no IComment component (only Partial<IComment>), and the comment routes declare IFile ' +
      '(ICommentGetResponse, ICommentListResponse, ICommentUpdateResponse = IFile)',
    apply: (spec) =>
      [
        addComponent(spec, 'IReactionClientTransformed', {
          type: 'object',
          properties: {
            type: string,
            owner: {
              type: 'object',
              properties: { _id: string, name: string, picture: string },
              required: ['_id'],
            },
          },
          required: ['type', 'owner'],
        }),
        addComponent(spec, 'IComment', {
          type: 'object',
          properties: {
            _id: string,
            body: string,
            thread: { anyOf: [string, ref('IEntitySummary')] },
            owner: ref('IEntitySummary'),
            project: string,
            timestamp: { type: 'string', format: 'date-time' },
            edited: { type: 'string', format: 'date-time' },
            reactions: { type: 'array', items: ref('IReactionClientTransformed') },
            mentions: strings,
            entityType: string,
          },
          required: ['_id', 'body', 'thread', 'owner', 'timestamp', 'reactions'],
        }),
        setResponse(spec, 'CommentGet', ref('IComment')),
        setResponse(spec, 'CommentList', { type: 'array', items: ref('IComment') }),
        setResponse(spec, 'CommentUpdate', ref('IComment')),
      ].some(Boolean),
  },
  {
    id: 'thread-comment-create',
    reason: 'IThreadCommentCreateRequest/Response use IThread; the route takes a comment and responds with it',
    apply: (spec) =>
      [
        setRequestBody(spec, 'ThreadCommentCreate', ref('Partial_IComment_')),
        setResponse(spec, 'ThreadCommentCreate', ref('IComment')),
      ].some(Boolean),
  },
  {
    id: 'comment-reaction-responses',
    reason: 'CommentReactionCreate declares IFile; it responds with the reaction and its owner summary',
    apply: (spec) => setResponse(spec, 'CommentReactionCreate', ref('IReactionClientTransformed')),
  },
  {
    id: 'comment-remove-responses',
    reason: 'CommentRemove and CommentReactionRemove declare IFile; they respond with an empty body',
    apply: (spec) =>
      ['CommentRemove', 'CommentReactionRemove']
        .map((operationId) =>
          assign(operation(spec, operationId).responses, '200', { description: 'OK (empty response)' }),
        )
        .some(Boolean),
  },
  {
    id: 'project-team-members',
    reason: 'IProject team members are populated with the user summary (name, stub, picture, blurb)',
    apply: (spec) => {
      const team = spec.components.schemas.IProject.properties.team.items
      return Object.entries({ name: string, stub: string, picture: string, blurb: string })
        .map(([key, value]) => assign(team.properties, key, value))
        .some(Boolean)
    },
  },
  {
    id: 'project-select',
    reason: 'GET /projects takes the `select` field list the frontend sends (IProjectListRequest omits it)',
    apply: (spec) => setQueryParameter(spec, 'ProjectList', 'select', strings),
  },
  {
    id: 'search-paging',
    reason: 'GET /search also reads select, size, page and published (ISearchGetRequest omits them)',
    apply: (spec) =>
      [
        setQueryParameter(spec, 'SearchGet', 'select', strings),
        setQueryParameter(spec, 'SearchGet', 'size', { type: 'number' }),
        setQueryParameter(spec, 'SearchGet', 'page', { type: 'number' }),
        setQueryParameter(spec, 'SearchGet', 'published', { anyOf: [{ type: 'boolean' }, string] }),
        setQueryParameter(spec, 'SearchGet', 'criteria', { type: 'object', additionalProperties: true }, false),
      ].some(Boolean),
  },
  {
    id: 'notification-fields',
    reason: 'INotificationClientTransformed omits _id, type, read and timestamp, which the route sends',
    apply: (spec) =>
      addProperties(spec, 'INotificationClientTransformed', {
        _id: string,
        type: string,
        read: { type: 'boolean' },
        timestamp: { type: 'string', format: 'date-time' },
      }),
  },
  {
    id: 'notification-mark-read',
    reason: 'NotificationMarkRead declares `transform` as required, the route works (and is called) without it',
    apply: (spec) => setQueryParameter(spec, 'NotificationMarkRead', 'transform', { type: 'boolean' }, false),
  },
]

/** Applies the overrides to a copy of the document; returns it with the ids of the ones that changed nothing */
export const applyOverrides = (document) => {
  const spec = structuredClone(document)
  const stale = overrides.filter((override) => !override.apply(spec)).map((override) => override.id)
  return { spec, stale }
}
