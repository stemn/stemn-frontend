/**
 * Types for the Redux conventions of the Stemn stores (see docs/TYPESCRIPT.md):
 *
 *   middleware: thunk · auth · throttle · httpPackage/httpTransform · websocket · redux-promise-middleware · ...
 *
 * - An action whose `payload` is a promise is resolved by redux-promise-middleware, which dispatches
 *   `<TYPE>_PENDING`, then `<TYPE>_FULFILLED` (payload: the resolved value) or `<TYPE>_REJECTED`
 *   (payload: the error, `error: true`). `dispatch` returns a promise of `{ value, action }`.
 * - `{ http: true, payload: <axios request config> }` actions are turned into the above by httpTransform
 *   (the payload becomes `axios(config)`), so their `_FULFILLED` payload is an AxiosResponse.
 * - Thunks (functions) are run by redux-thunk with `(dispatch, getState)`; `dispatch` returns what they return.
 */
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { Action, MiddlewareAPI } from 'redux'
import type { IFilesState } from 'stemn-shared/misc/Files/Files.reducer'

/**
 * The store slices shared code reads with getState(). The website and desktop root states are supersets
 * (reducer.ts / rootReducer.base.ts); add a slice here when its reducer is converted.
 */
export interface ISharedStoreState {
  files: IFilesState
}

/** `{ http: true }` action: httpTransform sends `payload` with axios */
export interface IHttpAction<T extends string = string, M = unknown> extends Action<T> {
  http: true
  payload: AxiosRequestConfig
  meta?: M
}

/** An action whose payload is a promise, resolved by redux-promise-middleware */
export interface IPromiseAction<T extends string = string, V = unknown, M = unknown> extends Action<T> {
  payload: Promise<V>
  meta?: M
}

/**
 * Desktop: an action run by the FunctionLibrary middleware of the main process, which calls
 * `functionAlias` (e.g. 'FileCache.get') with `functionInputs` and dispatches the result as the payload.
 */
export interface IAliasedAction<T extends string = string, I = unknown, M = unknown> extends Action<T> {
  aliased: true
  payload: { functionAlias: string; functionInputs: I }
  meta?: M
}

/** What `dispatch(promiseAction)` resolves to (redux-promise-middleware) */
export interface IPromiseResult<V> {
  value: V
  action: { type: string; payload: V; meta?: unknown }
}

/** `<T>_PENDING`, dispatched by redux-promise-middleware before the promise settles */
export type PendingAction<T extends string, M = undefined> = { type: `${T}_PENDING`; meta: M }

/** `<T>_FULFILLED`: `payload` is the resolved value (an AxiosResponse for axios / `http: true` actions) */
export type FulfilledAction<T extends string, P, M = undefined> = { type: `${T}_FULFILLED`; payload: P; meta: M }

/** `<T>_REJECTED`: `payload` is the error the promise rejected with */
export type RejectedAction<T extends string, E = unknown, M = undefined> = {
  type: `${T}_REJECTED`
  payload: E
  error?: true
  meta: M
}

/** The three actions an http request of type `T` produces; `D` is the response body */
export type HttpLifecycleActions<T extends string, D, M = undefined, E = unknown> =
  PendingAction<T, M> | FulfilledAction<T, AxiosResponse<D>, M> | RejectedAction<T, E, M>

/**
 * `dispatch` of the Stemn stores: thunks return what the thunk returns, promise and http actions return a
 * promise of `{ value, action }`, other actions are returned as they are.
 */
export interface IStemnDispatch {
  // `getState: () => never` accepts thunks written against any state shape (never is assignable to every S)
  <R>(thunk: (dispatch: IStemnDispatch, getState: () => never) => R): R
  <V>(action: IPromiseAction<string, V>): Promise<IPromiseResult<V>>
  (action: IHttpAction): Promise<IPromiseResult<AxiosResponse<unknown>>>
  // The main process returns whatever the aliased function produced (often a promise)
  (action: IAliasedAction): unknown
  <A extends Action>(action: A): A
}

/** A redux-thunk thunk, `S` being the slices it reads */
export type StemnThunk<R = void, S = ISharedStoreState> = (dispatch: IStemnDispatch, getState: () => S) => R

/** A Stemn middleware: `next` and `action` are unknown (anything can be dispatched, thunks included) */
export type StemnMiddleware<S = ISharedStoreState> = (
  api: MiddlewareAPI<IStemnDispatch, S>,
) => (next: (action: unknown) => unknown) => (action: unknown) => unknown
