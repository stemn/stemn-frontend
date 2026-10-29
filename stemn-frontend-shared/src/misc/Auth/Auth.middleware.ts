/** *************************************************************************************************

This middleware is used to confirm a user is authed

action = ({
  type: 'SOME_TYPE',
  auth: true,
})

When auth, true is found - the action will only run if it the user is authed

************************************************************************************************** */

import { get } from 'lodash'
import { push } from 'stemn-shared/routing'
import type { ISharedStoreState, StemnMiddleware } from 'stemn-shared/redux/types'

/** An action that only runs for a logged in user (otherwise the app goes to the login page) */
export interface IAuthRequiredAction {
  type: string
  auth: true
}

const requiresAuth = (action: unknown): action is IAuthRequiredAction => !!get(action, ['auth'])

const authMiddleware: StemnMiddleware<Pick<ISharedStoreState, 'auth'>> = (store) => (next) => (action) => {
  if (requiresAuth(action)) {
    const isAuthed = store.getState().auth.user._id && store.getState().auth.authToken
    if (isAuthed) {
      const newAction = { ...action, auth: undefined } // Create the new action
      next(newAction) // Dispatch the action
    } else {
      store.dispatch(
        push({
          pathname: 'login',
        }),
      )
    }
  } else {
    return next(action)
  }
}

export default authMiddleware
