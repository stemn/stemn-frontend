import { showModal }          from 'stemn-shared/misc/Modal/Modal.actions.js'
import { show as toastShow }  from 'stemn-shared/misc/Toasts/Toasts.actions.js'
import { has }                from 'lodash'

import connectionModalName from 'stemn-shared/misc/Modal/ConnectionModal'
import providerAccessRevokedModalName from 'stemn-shared/misc/Modal/ProviderAccessRevokedModal'
import providerAccessErrorModalName from 'stemn-shared/misc/Modal/ProviderAccessErrorModal'

/** *******************************************************************
This middleware will add an error modal/toast when possible.

We can process server errors of 3 types:
  type1:    (This is the prefered error type)
    {error: {message, type, data, code}}
  type2:
    {error: 'Some error string'}
  type3:
    {message: 'Some other error message'}

If we find a special toast or modal in errorMap[action.payload.errror.type]
this will be displayed instead of the standard toast.
******************************************************************** */

// The errors which will pop special modal/toast
const errorMap = {
  GOOGLE_CONNECTION_ERROR: {
    displayType: 'modal',
    modalType: providerAccessErrorModalName,
  },
  DRIVE_ACCESS_REVOKED: {
    displayType: 'modal',
    modalType: providerAccessRevokedModalName,
  },
  LINK_FOLDER_CONFLICT: {
    displayType: 'toast',
    message: error => (has(error, 'data.project.name')
      ? `Folder cannot be connect to two STEMN projects. Already connected to: '${error.data.project.name}'.`
      : error.message),
  },
}

const processLocalError = (store, action) => {
  // Local errors are electron only
  if (action.payload.errno === 'ENETUNREACH') {
    store.dispatch(showModal({
      modalType: connectionModalName,
      modalProps: action.payload.data,
      limit: 1,
    }))
  }
}

const processServerError = (store, action) => {
  // Get the toast message and error type
  const { message, type, data } = action.payload.response.data.error || action.payload.response.data

  // Get the message
  let toastMessage
  if (message && typeof message === 'string') {
    // Type 1
    toastMessage = message
  } else if (action.payload.response.data.error   && typeof action.payload.response.data.error === 'string') {
    // Type 2
    toastMessage = action.payload.response.data.error
  } else if (action.payload.response.data.message && typeof action.payload.response.data.message === 'string') {
    // Type 3
    toastMessage = action.payload.response.data.message
  }

  // Error Display Info
  const errorInfo = errorMap[type]

  // If we find display info in the error map, we show it
  if (errorInfo) {
    if (errorInfo.displayType === 'modal') {
      store.dispatch(showModal({
        modalType: errorInfo.modalType,
        modalProps: data,
      }))
    } else if (errorInfo.displayType === 'toast') {
      toastMessage = errorInfo.message(action.payload.response.data.error)
      store.dispatch(toastShow({
        type: 'error',
        title: toastMessage,
      }))
    }
  } else if (toastMessage) {
    // Else, if there is a message, show the toast
    store.dispatch(toastShow({
      type: 'error',
      title: toastMessage,
    }))
  }
}

const middleware = store => next => (action) => {
  if (action.type && action.type.endsWith('_REJECTED')) {
    if (has(action, 'payload.errno')) {
      processLocalError(store, action)
    } else if (has(action, 'payload.response.data.error') || has(action, 'payload.response.data.message')) {
      processServerError(store, action)
    }
  }
  return next(action)
}

export default middleware
