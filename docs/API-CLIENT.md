# API client and server state (TanStack Query)

The frontend talks to the Stemn API through a client **generated from the backend's OpenAPI document**, and keeps
server data in **TanStack Query** instead of Redux, one domain at a time. This document covers how the pieces fit,
how to regenerate the client, the rules while Redux and TanStack Query coexist, and the playbook for moving the
remaining domains. The decision record is ADR-008 in [DECISIONS.md](./DECISIONS.md).

Status: Projects (get, user lists, update), Threads (get, list, create, update, delete), Comments (all), Notifications
(all) and the current user (`/me`) are served by TanStack Query. Everything else is still Redux; see
[FUTURE-WORK.md](./FUTURE-WORK.md) for the remaining domains.

## Layout

Everything lives in `stemn-frontend-shared/src/api` (imported as `stemn-shared/api/...`, shared by the website and the
desktop renderers):

| File | What it is |
| --- | --- |
| `openapi.json` | Snapshot of the document the backend serves (`GET /api/v1/openapi.json`), committed |
| `schema.gen.ts` | **Generated** (openapi-typescript): `paths`, `components`, `operations` |
| `operations.gen.ts` | **Generated**: `<OperationId>Response` / `Body` / `Query` / `Path` types for every route, and `apiOperations` (method + path per operationId) |
| `types.ts` | Type helpers (`ApiResponse<'ThreadGet'>`, `Schemas['IThread']`, ...) |
| `models.ts` | Named entity types (`IThread`, `IComment`, `IProject`, `INotification`, `IMe`) |
| `client.ts` | `api` (openapi-fetch client), `unwrap`, `setApiTokenGetter`, `createApiClient` |
| `errors.ts` | `ApiError` and the error normalisation |
| `batch.ts` | `createBatcher`: single-entity reads batched into the `?ids[]=` list routes |
| `query/` | TanStack Query setup: client defaults, `queryKeys`, `QueryProvider`, the Redux middleware, the legacy bridge |
| `queries/` | One module per domain: query options, hooks, mutations, legacy mappings |
| `testing/` | Test helpers: MSW handlers by operationId, fixtures, a provider wrapper |

The generator is `stemn-frontend-shared/scripts/api-client/generate.mjs`; the spec corrections it applies are in
`scripts/api-client/overrides.mjs`.

## Regenerating

```sh
npm run api:generate                          # from the committed snapshot (no backend needed)
npm run api:generate -- --url local           # fetch http://localhost:3000/api/v1/openapi.json, update the snapshot
npm run api:generate -- --url https://...     # any other backend (or STEMN_OPENAPI_URL=...)
npm run api:check                             # fail if the generated files are not what the snapshot gives
npm run api:check -- --url local              # also fail if the backend serves a different document
```

When the backend changes its types: run `api:generate -- --url local` against a backend on that branch, run
`npm run typecheck` (the compiler lists every call that no longer matches), and commit the snapshot with the
generated files. Never edit `*.gen.ts` by hand.

CI runs `api:check` in the lint job (the generated files must match the snapshot). The e2e workflow also compares the
snapshot with the document of the backend under test and adds a **warning** (not a failure) when they differ, so a
backend change shows up without breaking unrelated frontend pull requests.

### Spec overrides

The document is generated from `@stemn/types` (stemn-backend ADR-018). A few of those types do not describe what the
API sends, so the generator corrects them first (`overrides.mjs`; the snapshot itself stays exactly what the backend
serves). Each override says why it exists and is a backend follow-up; when the backend is fixed, the override no longer
changes anything, the generator prints `override "<id>" no longer changes the document`, and the entry is deleted
(`overrides.test.mts` fails if an override is stale against the snapshot). Current overrides:

| Override | What the document says | What the API does |
| --- | --- | --- |
| `entity-summary`, `thread-populated`, `thread-create-response` | thread `owner`/`users`/`project` are ids; thread create returns `IFile` | populated `{ _id, name, stub, picture, blurb, entityType }`; create returns the thread |
| `comment-component`, `thread-comment-create`, `comment-reaction-responses`, `comment-remove-responses` | comment routes respond with `IFile`; comment create takes `Partial<IThread>` | they take/return comments, reactions with populated owners, or an empty body |
| `project-team-members` | team members are `{ _id, role, owner, group, permissions }` | also `name`, `stub`, `picture`, `blurb` |
| `project-select`, `search-paging` | `GET /projects` and `GET /search` omit `select`, `size`, `page`, `published` | they read them |
| `notification-fields`, `notification-mark-read` | notifications have no `_id`/`type`/`read`/`timestamp`; mark-read requires `transform` | they have them; `transform` is optional |

## The client

```ts
import { api, unwrap } from 'stemn-shared/api/client'

const thread = await unwrap(api.GET('/api/v1/threads/{threadId}', { params: { path: { threadId } } }))
//    ^ IThread: path, params, body and response are typed from the document
```

* **Why openapi-typescript + openapi-fetch** (ADR-008): the generated code is types only (no runtime to review), the
  runtime is a small fetch wrapper with middleware (a few KB), and both are stable. `@hey-api/openapi-ts` generates an SDK and
  TanStack Query option factories, but our keys have to match the websocket events, single reads have to be batched,
  and some domains have to sync with Redux; hand-written hooks over typed calls keep that in one readable place.
* **Query strings** use the axios 0.x format the API expects: arrays as `ids[]=a&ids[]=b`, objects (`criteria`) as
  JSON, `undefined` dropped. It is the same function as the axios defaults (`utils/legacyParamsSerializer`).
* **Auth**: each app calls `setApiTokenGetter(() => store.getState().auth.authToken)` in its `initHttp`, next to the
  axios interceptor. Every request gets `Authorization: bearer <token>` unless it sets the header itself.
* **Errors**: openapi-fetch does not throw; `unwrap` throws an `ApiError` for any non-2xx response. `ApiError` has the
  StemnError fields (`status`, `type`, `code`, `message`, `data`) and an axios-like `response: { status, data }`, which
  is what `ToastsError.middleware`, the error modals and legacy code read. Network failures are `ApiError`s with status
  0 (`type: 'NETWORK_ERROR'`); aborts stay `AbortError`s so TanStack Query recognises cancellations. The API's three
  error body shapes (`{ error: {...} }`, `{ error: 'string' }`, `{ message }`) are all normalised.
* **Batching**: `createBatcher` gives the httpPackage middleware's behaviour to queries: the ids requested within
  20 ms go out as one `GET /api/v1/<entities>?ids[]=...` (at most 20 per request, the API's limit), and an item the
  API answers with `{ _id, error: 'Not Found' }` rejects only its own query (404). A thread timeline loading 30 comment
  queries makes two requests.

## TanStack Query setup

Both apps create one QueryClient per JS context: the website tab, and each desktop renderer window (main, menubar,
preview). The Electron main process has none.

* `createStemnQueryClient` (`query/queryClient.ts`): `staleTime` 30 s (freshness comes from the websocket and the
  mutations, not polling), `gcTime` 5 min, refetch on focus and reconnect (catches events missed while hidden or
  offline), no retry of 4xx responses, two retries otherwise, no mutation retries.
* **Errors are toasted through Redux**: the QueryCache/MutationCache `onError` dispatches `API/QUERY_REJECTED` /
  `API/MUTATION_REJECTED` with the error as a plain object, so the existing ToastsError middleware shows the same
  toasts and modals as for the Redux http actions. Failing background refetches (data already on screen) and queries
  with `meta.silent` are not toasted.
* `QueryProvider` wraps the app (inside the Redux `Provider`) and adds the devtools in development builds only (they
  are not in the production bundle).
* `setQueryClient` registers the client for non-React code (thunks, the websocket event map); `window.__STEMN__`
  exposes it in the desktop renderers for debugging and the e2e tests.

### Query keys

All keys come from `queryKeys` (`query/keys.ts`) and are hierarchical, so a prefix invalidates a group and an object
segment matches partially:

```ts
queryKeys.me                                   // ['me']
queryKeys.projects.detail(id)                  // ['projects', 'detail', id]
queryKeys.projects.byUser(userId, true)        // ['projects', 'user', userId, { includePrivate: true }]
queryKeys.threads.detail(id)                   // ['threads', 'detail', id]
queryKeys.threads.list({ projectId, page, size, criteria })
queryKeys.threads.projectLists(projectId)      // matches every list of the project, any filter/page
queryKeys.comments.detail(id)
queryKeys.notifications.list()
```

### The per-domain pattern

Each `queries/<domain>.ts` module exports, in this order:

1. `<domain>Queries`: `queryOptions` factories (key + fetcher + meta), usable by hooks and by imperative code
   (`queryClient.fetchQuery(threadQueries.detail(id))`).
2. `use<Entity>` hooks: `useQuery({ ...<domain>Queries.x(args), enabled })`.
3. `use<Verb><Entity>` mutation hooks: optimistic updates with rollback where the UI expects an instant change
   (thread fields, reactions, notifications read), cache updates or invalidation on success, and the Redux side
   effects the domain still has (timeline events, legacy entries).
4. `<domain>LegacyInvalidations`: the legacy Redux actions that make its queries stale (see below).

Containers stay thin: a function component calls the hooks and renders the existing presentational component.
`toLegacyEntity(query)` gives a query result the `{ data, loading, error }` shape those components were written for.

## Coexistence rules (Redux + TanStack Query)

1. **One owner per domain.** Once a domain is migrated, its server data is owned by TanStack Query. New code reads it
   with the hooks, never from Redux, and writes it with the mutations. Redux keeps client state (auth session, forms
   still bound to the store, filters, modals, the router) and the domains not migrated yet.
2. **Fully migrated domains have no Redux slice.** Comments and Notifications: their reducers and actions are deleted.
3. **Partially migrated domains keep a Redux projection while it has readers**, and it is written only by the bridge:
   * `projects.data[id]` and `projects.userProjects[userId]` are written from the project queries (`meta.legacySync`,
     `query/legacyBridge.ts`) for the ~25 project tab containers and the desktop pages that still read them;
   * `auth.user` is written from the `me` query (`loadUserData` goes through the query);
   * the thread board (`threads.data`, `threads.boards`) still loads itself; thread mutations refresh a thread entry
     Redux already holds (`syncLegacyThread`).
   The bridge dispatches only when the data really changed (structural sharing keeps the reference of an equal
   refetch), so a refetch does not reset forms bound to those slices.
4. **Legacy writes invalidate.** A Redux action that changes migrated data (the desktop board saving a thread, the
   settings forms saving a project, the user settings saving the user) is mapped to the query keys it makes stale
   (`legacyInvalidations`, applied by `createQueryMiddleware`). Actions the bridge dispatches carry `meta.fromQuery`
   and are never mapped back (no loops).
5. **Auth changes reset the cache.** Logging out clears it; logging in (or a new token) refetches everything active.
6. **Realtime stays on the websocket.** Events invalidate query keys; they do not carry data (next section).
7. **Errors keep one UX.** Query and mutation errors are toasted through the Redux ToastsError middleware.

## Realtime (websocket invalidation)

`misc/Websocket/eventMap` maps server events to refreshes. For migrated data it dispatches
`invalidateQueries(...keys)` (`API/INVALIDATE_QUERIES`), a plain Redux action:

* on the website, the store's query middleware calls `queryClient.invalidateQueries`; mounted queries refetch;
* in the desktop app the websocket runs in the **main process**, which has no QueryClient: the action is reduced
  there and replayed into every renderer window (the existing store sync), whose query middleware (placed after
  `forwardToMain`) invalidates that window's cache.

`refresh(store, keys, legacy)` also runs the Redux refetch when no mounted component observes those queries in this JS
context, i.e. when only Redux readers may need it (always in the main process).

| Event | Room | Refreshes |
| --- | --- | --- |
| `THREAD/THREAD_UPDATED` | thread | thread detail + thread lists; the thread timeline (Redux); the Redux thread if held |
| `THREAD/COMMENT_UPDATED` | thread | comment detail |
| `BOARD/GROUPS_UPDATED` | board | the project's thread lists (thread created/moved/deleted); the Redux groups |
| `BOARD/THREADS_UPDATED`, `BOARD/TASK_COMPLETED_UPDATED` | board | thread details (or the Redux threads) |
| `BOARD/COMMENTS_UPDATED` | board | comment details |
| `PROJECT/PROJECT_UPDATED` | project | project detail (the bridge updates `projects.data`), or the Redux project |
| `PROJECT/ADDED_TO_PROJECT` | user | the current user's project lists, or the Redux list |

The thread list page now joins the board room, so threads created by others appear live. The thread timeline is still
Redux and the API serves timelines stale-while-revalidate, so after `THREAD/THREAD_UPDATED` the timeline is requested
once to start the recomputation and fetched into Redux 1.5 s later (see FUTURE-WORK: timeline domain).

## Migration playbook (per domain)

1. **Inventory**: grep the Redux slice (`state.<slice>`), its actions and the event map; list readers per app
   (website, shared, desktop) and the model-bound inputs (`model="<slice>..."`) that write it.
2. **Check the spec** for the routes (`operations.gen.ts`): wrong or missing types get an override with a reason
   (and a backend follow-up), never a cast in the hook.
3. **Keys**: add the domain to `queryKeys`, hierarchical, with the ids the websocket events carry.
4. **Queries module** (`queries/<domain>.ts`): query options, hooks, mutations following the pattern above. Batch
   single reads that are rendered in lists with `createBatcher`.
5. **Realtime**: in the event map, invalidate the keys with `refresh(...)`, keeping the Redux refetch as the fallback
   while Redux readers remain.
6. **Containers**: replace `connect` + fetchDataHoc + http actions with the hooks; keep the presentational components
   (`toLegacyEntity`). Replace model-bound inputs with local state or `react-hook-form` (the shared inputs accept
   `onChange(value)` without a `model`).
7. **Coexistence**: while other readers remain, add `meta.legacySync` (Redux projection) and
   `<domain>LegacyInvalidations` (legacy writes). When the last reader moves, delete the reducer, the actions, the
   bridge entries and the `fallback` in the event map.
8. **Tests**: MSW tests for the hooks (`testing/msw.ts`: `apiHandler('ThreadGet', ...)`), an e2e assertion for the
   live behaviour, both e2e suites green.

## Testing

* Unit (Vitest): `client.test.ts` (serialisation, auth, error mapping, against MSW handlers built from the document's
  operations), `batch.test.ts`, `query/*.test.ts` (middleware, bridge, error routing), `queries/hooks.test.ts`
  (the hooks with a real QueryClient and Redux store: batching, optimistic updates and rollbacks, mutation scopes,
  legacy sync), `Websocket/eventMap/eventMap.test.ts`, `scripts/api-client/overrides.test.mts`.
* Website e2e: `tests/e2e/specs/threads-live.spec.ts` (changes by another user arrive live: thread list, rename,
  comment, comment edit, close; the thread mutations from the UI; notifications and mark-as-read).
* Desktop e2e: the thread modal's comments come from the renderer's query cache and update live through the main
  process websocket.

## Known backend issues found on the way

* `PUT /comments/:id` addresses `THREAD/COMMENT_UPDATED` to the room of the request body's `thread` instead of the
  stored comment's, and `$set`s every field of the body. The client sends only `{ _id, body, thread }` (the legacy
  action sent the whole cached comment, populated reactions included).
* The timeline cache's `HISTORY/HISTORY_UPDATED` event is not routed by the websocket server, so clients cannot know
  when a revalidated timeline is ready.
* The websocket event for file changes is `FILE/FILES_UPDATED`; the frontend listens for `FILES/FILES_UPDATED`.
* The `@stemn/types` mismatches listed under "Spec overrides".
