# Future work

Tracked follow-ups of the 2026 modernisation that are not done yet. Each item links to the document with the details.

## Remaining domains to move to the generated client + TanStack Query

ADR-008, playbook in [API-CLIENT.md](./API-CLIENT.md#migration-playbook-per-domain). Migrated so far: Projects (get,
user lists, update), Threads (get, list, create, update, delete), Comments, Notifications, the current user.

Proposed order (dependencies first, then by reach; sizes are the number of HTTP calls in the Redux actions):

| # | Domain | Redux today | Size | Notes |
| --- | --- | --- | --- | --- |
| 1 | **Timeline** (`SyncTimeline`: thread/project/user timelines, feed, counts) | `syncTimeline` | 3 | Unblocks dropping the thread-timeline workaround in the event map; needs a backend event when a revalidated timeline is ready (or the cache removed) |
| 2 | **Boards and groups** (the rest of Threads: board, groups, move, labels, the kanban `ThreadsDisplay`, thread modal) | `threads` | 14 | Then delete `threads` and `syncLegacyThread`; the board's model-bound inputs need local state |
| 3 | **Projects, the rest** (create, delete, clone, link/unlink remote, team, fields; `ProjectRow`; desktop project pages) | `projects` | 9 | Then delete `projects` and the project legacy bridge; settings forms to react-hook-form |
| 4 | **Users** (profiles, followers, following, stars, settings) | `users`, `userFollowers`, `userFollowing`, `userStars`, `userSettings` | 7 | Then `auth.user` readers can move to `useMe` and the `auth` slice keeps only the session |
| 5 | **Social** (follow, like) and **Search / Autosuggest** | `social`, `search`, `autosuggest` | 6 | Optimistic follow/like |
| 6 | **Files, commits, changes, history, fields** | `files`, `fileList`, `fileCompare`, `commits`, `changes`, `history`, `fields`, `relatedFields` | ~20 | Desktop-heavy (FileCache, local paths): migrate after the renderer patterns are proven |
| 7 | **Pipelines, terminal** | `pipelines`, `terminal` | 6 | Live step logs over the websocket: stream into the query cache |
| 8 | **Auth actions** (login, register, tokens, password, linked accounts) | `auth` | 10 | Mutations only; the session (token) stays client state |

When the last domain is done: remove the `httpPackage` / `httpTransform` middleware, the axios defaults and the
`legacyInvalidations` / bridge plumbing.

## Backend follow-ups found by the API client work

See [API-CLIENT.md](./API-CLIENT.md#known-backend-issues-found-on-the-way): the `@stemn/types` mismatches behind the spec
overrides, the comment-update websocket room, the unrouted `HISTORY/HISTORY_UPDATED` event, and the
`FILE/FILES_UPDATED` vs `FILES/FILES_UPDATED` event name.
