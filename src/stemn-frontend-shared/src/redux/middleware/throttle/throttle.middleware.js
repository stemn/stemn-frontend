/** *************************************************************************************************

This middleware is used to throttle actions

The action should contain a throttle object such as:

export function getThread({threadId}) {
  return {
    type: 'THREADS/GET_TASK',
    throttle: {
      time: 1000,                                   Time period (ms) to throttle to
      endpoint:  `THREADS/UPDATE_TASK-${thread._id}`    Unique endpoint (used to store the timeout in the timeouts object)
    },
    payload: {

    }
  }
}

************************************************************************************************** */

import i from 'icepick'
const timeouts = {}

export default store => next => (action) => {
  if (action && action.throttle && action.throttle.endpoint && action.throttle.time) {
    const { endpoint, time } = action.throttle

    if (timeouts[endpoint]) {                                           // If the timeout exists:
      clearTimeout(timeouts[endpoint])                                // Clear the timeout
    }

    timeouts[endpoint] = setTimeout(() => {                             // Create the timeout
      const newAction = i.assocIn(action, ['throttle'], undefined)   // Create the new action
      next(newAction)                                                 // Dispatch the action
    }, time)
  } else {
    return next(action)
  }
}
