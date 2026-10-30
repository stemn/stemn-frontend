/** A wrapper with the app's providers (fresh QueryClient, a small Redux store) for hook tests */
import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, legacy_createStore as createStore, type Reducer, type UnknownAction } from 'redux'
import { thunk } from 'redux-thunk'
import { createQueryMiddleware } from '../query/invalidation'
import { legacyInvalidations } from '../query/legacyInvalidations'
import { createStemnQueryClient } from '../query/queryClient'

export interface ITestState {
  auth: { authToken: string | null; user: { _id?: string; name?: string; picture?: string } }
  [slice: string]: unknown
}

export const createTestQueryClient = () => {
  const queryClient = createStemnQueryClient()
  // No retries and no cache time in the tests
  queryClient.setDefaultOptions({
    queries: { retry: false, gcTime: Infinity, staleTime: 0 },
    mutations: { retry: false },
  })
  return queryClient
}

/**
 * A store that records every action and applies `reducer` (default: keep the initial state, except
 * that AUTH/LOGOUT clears the token), with the query middleware.
 */
export const createTestStore = (queryClient: QueryClient, initialState: ITestState, reducer?: Reducer<ITestState>) => {
  const actions: UnknownAction[] = []
  const baseReducer: Reducer<ITestState> = (state = initialState, action) => {
    actions.push(action)
    if (action.type === 'AUTH/LOGOUT') return { ...state, auth: { ...state.auth, authToken: null } }
    return reducer ? reducer(state, action) : state
  }
  const store = createStore(
    baseReducer,
    initialState,
    applyMiddleware(thunk, createQueryMiddleware(queryClient, { legacyInvalidations })),
  )
  return { store, actions }
}

export const createWrapper = (queryClient: QueryClient, store: ReturnType<typeof createTestStore>['store']) => {
  // createElement: this module also exports non-components (no JSX file, see react-refresh)
  const Wrapper = ({ children }: { children?: ReactNode }) =>
    // eslint-disable-next-line @eslint-react/jsx-no-children-prop -- createElement (not JSX): react-redux types `children` as a required prop
    createElement(Provider, { store, children: createElement(QueryClientProvider, { client: queryClient }, children) })
  return Wrapper
}
