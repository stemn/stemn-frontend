import i from 'icepick'
import http from 'axios'

const transformHttp = store => next => (action) => {
  // If the action has action.http = true, we wrap the payload in axios.
  let modifiedAction
  if (action && action.http) {
    modifiedAction = i.merge(action, {
      payload: http(action.payload).then(action.then),
    })
  } else {
    modifiedAction = action
  }
  return next(modifiedAction)
}

export default transformHttp
