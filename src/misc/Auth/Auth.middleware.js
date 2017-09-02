/** *************************************************************************************************

This middleware is used to confirm a user is authed

action = ({
  type: 'SOME_TYPE',
  auth: true,
})

When auth, true is found - the action will only run if it the user is authed

************************************************************************************************** */

import { get } from 'lodash'
import i from 'icepick'
import { push } from 'react-router-redux'

export default store => next => (action) => {
  if (get(action, ['auth'])) {
    const isAuthed = store.getState().auth.user._id && store.getState().auth.authToken
    if (isAuthed) {
      const newAction = i.assocIn(action, ['auth'], undefined)    // Create the new action
      next(newAction)                                             // Dispatch the action
    } else {
      store.dispatch(push({
        pathname: 'login',
      }))
    }
  } else {
    return next(action)
  }
}
