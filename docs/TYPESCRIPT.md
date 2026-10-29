# TypeScript conversion playbook

How the Stemn frontend moves from JavaScript to strict TypeScript, one module at a time (ADR-007 in
[DECISIONS.md](./DECISIONS.md)). PR 5 sets up the mechanism and converts the first modules: `stemn-shared/routing`,
`misc/Websocket`, `misc/Auth` and the non-UI part of `misc/Files`.

## How it works

Two kinds of type-checking run side by side.

| Project | Settings | What it covers |
| --- | --- | --- |
| `stemn-frontend-website/tsconfig.json`, `stemn-frontend-desktop/tsconfig.json` (base: `/tsconfig.json`) | `strict` but `noImplicitAny: false`, `allowJs: true`, `checkJs: false` | everything: TS files are checked loosely, JS files are only read |
| `/tsconfig.strict.json`, run through `stemn-frontend-website/tsconfig.strict.json` and `stemn-frontend-desktop/tsconfig.strict.json` | `strict` + `noImplicitAny` | the converted modules listed in its `include` (the **ratchet**) |

* **`allowJs` without `checkJs`.** JavaScript modules are part of the programs, so a TS file importing a JS module
  gets the types TypeScript infers from it (before PR 5 it got `any`). JS files are not type-checked. JSDoc in a JS
  file is read too, which is how to fix an inferred signature that is too strict for its TS callers (see below).
* **The ratchet.** `tsconfig.strict.json` lists the converted modules. A module enters the list once it is converted
  and never leaves it. `npm run typecheck` (and so CI) runs it, so a converted module cannot regress. ESLint reads the
  same list and makes `@typescript-eslint/no-explicit-any` an error in those files (`eslint.config.mjs`).
* **Per platform.** The strict project runs twice: once resolved like the website (`.web.*` first, the website
  aliases) and once like the desktop renderers (`.desktop.*` first), so both variants of a platform module are checked
  in their real context. The list itself lives in one place, the root `tsconfig.strict.json`.
* **Transitive imports.** TypeScript has no per-file strictness: every *TypeScript* file a listed module imports is
  checked with the strict settings too. JavaScript dependencies are fine (they are not checked). So convert leaves
  first, or convert a small TS dependency in the same PR and list it (PR 5 did that for
  `SyncTimeline/SyncTimeline.actions.ts`, imported by the websocket event map). Today `redux/draft.ts`,
  `FileList/types.ts` and `Buttons/SimpleIconButton` are checked this way without being listed.

Commands:

```sh
npm run typecheck          # website + desktop + e2e + the strict project (both platforms)
npm run typecheck:strict   # the strict project only
```

## Picking the next module

1. Prefer **leaves**: modules whose TS imports are already strict (JS imports do not matter). `tsc --listFilesOnly -p
   stemn-frontend-website/tsconfig.strict.json` shows what a strict run pulls in.
2. Prefer **non-UI first**: action creators, reducers, middleware and utils. They carry the types the components need
   (state slices, action payloads), they have unit tests, and they rarely touch JSX or CSS modules.
3. Keep a PR to **one feature folder** (or one layer of a big one), so the review is about types, not behaviour.
4. A module with tests is cheaper: the tests prove the conversion changed nothing.

## Converting a module

1. **Rename with `git mv`** (`X.js` -> `X.ts`, `X.jsx` -> `X.tsx`), one commit per module group, so the history keeps
   the file identity. Change as little else as possible in the same commit; formatting is Prettier's job.
2. **Drop `.js` / `.jsx` extensions from the imports of the renamed files** (`'stemn-shared/misc/Auth/Auth.reducer.js'`
   -> `'stemn-shared/misc/Auth/Auth.reducer'`). TypeScript maps `.js` to `.ts`, but the webpack fallback does not.
   `grep -rn "misc/<Feature>/.*\.jsx\?'"` finds them.
3. **Add the module to `tsconfig.strict.json`** (folder or files, with its tests) and run `npm run typecheck:strict`.
4. **Type it** (next sections). Keep runtime behaviour identical: annotations, `as const`, `satisfies`, interfaces and
   type-only imports are fine; moving logic, adding `?.` or guards is not (that is a separate, reviewed change).
5. **Fix the fallout** in the loosely checked projects (`npm run typecheck`): callers now see precise types. Fix the
   caller if it is TS; if it is JS with a wrong inferred signature, add JSDoc (below).
6. `npm run lint`, `npm test`, `npm run build`, `npm run build:webpack`, `npm run desktop:build`.

### What "done" means for a module

* every file is `.ts` / `.tsx` and listed in `tsconfig.strict.json`, tests included;
* no `any`, except where it is the honest type, with an `eslint-disable-next-line @typescript-eslint/no-explicit-any
  -- <reason>` comment; casts (`as`) only at real boundaries (server data, `window.open`, a union the code
  narrows by hand) with a comment saying why the cast holds;
* `@ts-expect-error -- <reason>` only for a known pre-existing bug that the conversion must not fix (it fails the
  build once the bug is fixed, so it cannot be forgotten);
* exported state, action and input types, so the next module can use them;
* `.web` / `.desktop` variants implement one shared contract (below);
* the existing tests pass unchanged (typing their fixtures is fine).

## Typing Redux code

The store conventions are typed once in `stemn-frontend-shared/src/redux/types.ts`. The middleware chain is
`thunk · auth · throttle · httpPackage · httpTransform · websocket · redux-promise-middleware · ...`.

### State slices

Each reducer exports its state interface (`IAuthState`, `IFilesState`, `IWebsocketState`). Shared code reads the
store through `ISharedStoreState` (the slices both apps have, grown as reducers are converted). The app root states
(`stemn-frontend-website/.../app/reducer.ts`, `stemn-frontend-desktop/app/shared/reducers/rootReducer.base.ts`) are
supersets. Code that needs an app- or desktop-only slice declares just that slice (e.g. `IDesktopPathState` in
`Files/actions/getFullPath.desktop.ts`). Model what the reducer really holds: `user: Partial<IAuthUser>` because it is
`{}` until loaded, `Partial<IAuthState>` as the input of a reducer that hydrates a persisted state.

### Reducers and their actions

Type the actions the reducer handles as a discriminated union on `type`, and accept any other action:

```ts
export type WebsocketAction = IJoinRoomAction | ILeaveRoomAction

export default (state: IWebsocketState = initialState, incoming: WebsocketAction | UnknownAction = {} as UnknownAction) => {
  // Every action of the app comes through here; the switch only reads the ones it knows
  const action = incoming as WebsocketAction
  switch (action.type) { ... }
}
```

The cast is needed because `UnknownAction` (`type: string`) does not narrow in a `switch`; it is safe because the
`switch` only reads payloads after matching one of its own types.

### Http actions (`http: true`) and promise actions

An action `{ type: 'X', http: true, payload: { url, method, params } }` is sent with axios by httpTransform; an action
whose `payload` is a promise is resolved by redux-promise-middleware. Both produce `X_PENDING`, then `X_FULFILLED`
(payload: the resolved value, an `AxiosResponse` for http) or `X_REJECTED` (payload: the error):

```ts
export const getMeta = (input: IFileRevisionInput): IHttpAction<'FILES/GET_META', { cacheKey: string }> => ({
  type: 'FILES/GET_META', http: true, payload: { method: 'GET', url }, meta: { cacheKey },
})

// in the reducer's union: PENDING / FULFILLED (AxiosResponse<IFile>) / REJECTED, all with the meta
type FilesAction = HttpLifecycleActions<'FILES/GET_META', IFile, { cacheKey: string }> | ...
```

`PendingAction`, `FulfilledAction` and `RejectedAction` build the lifecycle by hand when the payload is not an
axios response (e.g. the desktop file cache). For a promise payload, type the promise (`http<ITokenResponse>(...)`):
`dispatch` then returns `Promise<IPromiseResult<AxiosResponse<ITokenResponse>>>`. Literal `type`s need `as const` (or
a return type) when the action is not otherwise typed. The desktop `aliased: true` actions (run in the main process
by the FunctionLibrary middleware) are `IAliasedAction`.

### Thunks and middleware

```ts
export const joinRoom =
  ({ room, type }: IRoom): StemnThunk<void, Pick<ISharedStoreState, 'websocket'>> =>
  (dispatch, getState) => { ... }
```

`StemnThunk<R, S>` is a thunk returning `R` that reads the slices `S`. `IStemnDispatch` knows the conventions: a thunk
returns what the thunk returns, a promise or http action returns a promise of `{ value, action }`, a plain action is
returned as is. Middleware is a `StemnMiddleware<S>` (`next` and `action` are `unknown`: narrow with a type guard).
Action creators imported from JS have inferred types; that is usually enough for `dispatch`.

## Platform modules (`.web` / `.desktop` / `.electron`)

Shared code imports `./X`; the bundler (and `moduleSuffixes` in each tsconfig) picks `X.web.ts` or `X.desktop.ts`.
Both variants implement one contract, declared in a platform-neutral file next to them (`Files/actions/types.ts`,
`Auth/actions/types.ts`), so shared callers see the same API on both platforms:

```ts
// types.ts
export type SaveFile = (input: ISaveFileInput) => StemnThunk<Promise<unknown>>
// saveFile.web.ts and saveFile.desktop.ts
export const saveFile: SaveFile = ({ file, fileUrl, anchorEl }) => (dispatch) => ...
```

Annotate (`: SaveFile`) when both variants have the same type; use `satisfies` when they return platform-specific
actions that share a contract (`export const getFile = ((input: IGetFileInput) => ...) satisfies GetFile`). Keep the
`index.web.ts` / `index.desktop.ts` export lists identical except for platform-only additions. The strict project
checks each variant in its own platform run; `.electron.*` files are desktop main process only.

## CSS modules, assets, globals

* `import classes from './X.module.scss'` is typed by `vite/client` (referenced from `typings.d.ts` and
  `stemn-frontend-desktop/typings.d.ts`) as a `{ [className: string]: string }` map. Global stylesheets are side-effect
  imports. There are no per-file class name types; add `typed-css-modules` (or similar) only if a typo-safe class map
  becomes worth a build step.
* Images (`.svg`, `.png`, ...) are URL strings (`vite/client`; webpack's asset modules emit the same). Electron
  `?asset` imports are declared in `stemn-frontend-desktop/typings.d.ts`.
* `GLOBAL_ENV` is declared in both typings files (the desktop one also has `APP_VERSION`); keep them in sync.

## Untyped dependencies

* JS modules of this repo: typed by inference. When an inferred signature is too strict (JS destructured parameters
  without defaults are inferred as required), add JSDoc to the JS function rather than casting in the caller:
  ```js
  /** @param {{ projectId: string, size?: 'sm' | 'md' | 'lg', force?: boolean }} input */
  export const getProject = ({ projectId, size = 'lg', force }) => ...
  ```
  (PR 5 did this for `getProject`, the toast `show`, `openFile` and Header's `mapStateToProps`.)
* npm packages: use the bundled types or `@types/<name>` (devDependency of the workspace that imports it). Otherwise
  declare the part you use, in both typings files (`declare module '@stemn/whats-that-gerber'`). Untyped packages
  used today: `redux-logger` and `redux-immutable-state-invariant` (only imported by the JS store setup, so nothing
  to do until `configureStore` is converted: then add `@types/redux-logger` or a declaration). `redux/types.ts`
  describes the store conventions itself rather than relying on the middleware packages' types.
* Vendored code: a `.d.ts` next to it (`Websocket/primus-websockets2.d.ts`), declaring only what the app uses.

## Known issues found by the conversion

Kept as they are (PR 5 changes no behaviour); each is a small follow-up:

* `Websocket/eventMap/pipeline.ts`: PIPELINE/STEP_LOGS calls `addLines({ terminalId, lines })`, but `addLines` reads
  `stepId`, so live step logs are stored under `lines.undefined` (marked with `@ts-expect-error`).
* `Auth/actions/logout.ts`: AUTH/LOGOUT clears the user before `leaveRoom` reads `user._id`, so the user room is
  never left.
* `Files/actions/togglePreviewMarkdown.ts` dispatches USER_SETTINGS/TOGGLE_PREVIEW_MARKDOWN, which no reducer handles;
  the Files reducer toggles `previewMarkdown` on FILES/TOGGLE_PREVIEW_MARKDOWN, which nothing dispatches.
* `Files.reducer` stores `payload.data` of a rejected FILES/GET_FILE, but an axios error carries the body in
  `response.data`, so the stored error is undefined.
* `Auth/actions/confirmLinkedinImport.ts` relies on the website's `authenticate` returning a promise; the desktop
  variant returns the plain action (it is only used by the website).

## Order for the rest of the codebase

About 840 JS/JSX files (34k lines) remain. Rough sizes are JS files / lines.

1. **Redux infrastructure** (~10 files, ~600 lines): `redux/middleware` (httpPackage, httpTransform, throttle; tested),
   `redux/utils.js`, list `redux/draft.ts`; `misc/Store`, `misc/Toasts` (6 / 310), the action side of `misc/Modal`,
   `misc/FunctionLibrary`, `utils/*` (12 / 190). Everything else dispatches through these.
2. **Data modules, actions + reducers only**, growing `ISharedStoreState` (most have reducer tests): Projects
   (12 / 1030), Users (10 / 270), UserSettings (18 / 690, actions + reducer first), Comments (9 / 640), Changes
   (8 / 620), SyncTimeline (rest, 10 / 800), FileList (18 / 850), Pipelines (15 / 510), Threads actions + reducer (of
   49 / 3020), Search, Notifications, Mentions, Terminal, Social, Upload, Fields, History, ... Once every slice is
   typed, derive the root states from `combineReducers` in `app/reducer.ts` and `rootReducer.base.ts`.
3. **Desktop**: `stemn-frontend-shared/src/desktop` (24 / 1090), `stemn-frontend-desktop/app/shared` (10 / 290) and the
   Electron main process `app/main` (14 / 930), where typed IPC and Electron APIs pay off most (the preload bridge is
   already TS).
4. **Leaf components** (Buttons, Loading, Layout, Panels, Tags, Tables, Avatar, Titles, Icons, ...; ~60 files,
   ~2k lines), then their containers (`connect` with typed `mapStateToProps` on `ISharedStoreState`).
5. **Large UI trees**: Files PreviewFile / Download / Readme (~40 / 1600), Threads UI, Editor (14 / 680), Popover
   (5 / 840), Modal UI (31 / 650), FileList UI, ProjectSettings, Search.
6. **Apps**: website `modules` (23 / 615) and `pages` (158 / 5760, page by page), desktop renderers (50 / 2580),
   shared `pages` (8 / 360).
7. **Finish**: when everything is listed, turn on `noImplicitAny` in the base config, drop `allowJs`, merge
   `tsconfig.strict.json` back into the app configs, and re-enable the ESLint rules switched off for the legacy code
   (ADR-003). `noUncheckedIndexedAccess` is not enabled yet: on the current strict set it reports ~20 errors, mostly
   index lookups in `redux/draft.ts`, the desktop path helpers and the tests, that would need `!` or new guards;
   revisit it once the reducers are converted.
