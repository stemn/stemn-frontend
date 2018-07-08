import getUuid from 'stemn-shared/utils/getUuid.js'

export function show({ type, title, options, actions, confirm, reject }) {
  return {
    type: 'TOAST/SHOW',
    payload: {
      id: getUuid(),
      type, // 'error' || default
      title,
      options,
      actions,
      confirm,
      reject,
    },
  }
}

export function hide({ id }) {
  return {
    type: 'TOAST/HIDE',
    payload: {
      id,
    },
  }
}
