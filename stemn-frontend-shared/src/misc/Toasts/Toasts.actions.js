import getUuid from 'stemn-shared/utils/getUuid.js'

/**
 * Show a toast. Only `title` is required (the JSDoc types are read by TypeScript callers, allowJs)
 * @param {{ type?: 'error', title: string, options?: object, actions?: object[], confirm?: unknown, reject?: unknown }} toast
 */
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
