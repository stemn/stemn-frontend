import { push } from 'stemn-shared/routing'
import type { IStemnDispatch, ISharedStoreState, StemnDispatchable, StemnThunk } from 'stemn-shared/redux/types'

type AuthedCallback<R> = (dispatch: IStemnDispatch, getState: () => ISharedStoreState) => R

/**
 * Runs `actionToRun` for a logged in user, otherwise goes to the login page.
 * `actionToRun` returns the action (or thunk) to dispatch; with `noDispatch` it is just called.
 */
function confirmAuth(actionToRun: AuthedCallback<unknown>, noDispatch: true): StemnThunk
function confirmAuth(actionToRun: AuthedCallback<StemnDispatchable>, noDispatch?: false): StemnThunk
function confirmAuth(actionToRun: AuthedCallback<unknown>, noDispatch?: boolean): StemnThunk {
  return (dispatch, getState) => {
    if (getState().auth.authToken && getState().auth.user._id) {
      if (noDispatch) {
        actionToRun(dispatch, getState)
      } else {
        // The overloads guarantee a dispatchable result here
        dispatch(actionToRun(dispatch, getState) as StemnDispatchable)
      }
    } else {
      dispatch(
        push({
          pathname: '/login',
        }),
      )
    }
  }
}

export default confirmAuth
