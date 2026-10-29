/**
 * Make a redux action safe to send over Electron IPC (structured clone).
 *
 * Electron <= 8 serialised IPC messages like JSON, silently dropping functions.
 * Since Electron 9 IPC uses the structured clone algorithm, which throws on
 * functions, promises and DOM/Node objects. Redux actions in this app can carry
 * React component references (modalType), promises and axios errors (which
 * reference sockets), so they are cleaned the old way:
 *  - functions, symbols and promises are dropped
 *  - Errors become plain { name, message, ... } objects (axios errors keep
 *    `response.{status,statusText,data}` and `config.{url,method}`)
 *  - objects with toJSON() (moment, AxiosHeaders, ...) are serialised with it
 *  - binary data (ArrayBuffer, typed arrays, Buffer) and Dates are kept as is
 *  - circular references are dropped
 */
const MAX_DEPTH = 64

const isThenable = value => value && typeof value.then === 'function'

const axiosErrorToPlain = error => ({
  name: error.name,
  message: error.message,
  code: error.code,
  isAxiosError: true,
  response: error.response
    ? {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
    }
    : undefined,
  config: error.config
    ? { url: error.config.url, method: error.config.method, baseURL: error.config.baseURL }
    : undefined,
})

export const toIpcSafe = (input) => {
  const ancestors = []

  const clone = (value, depth) => {
    if (value === null || value === undefined) return value
    const type = typeof value
    if (type === 'string' || type === 'number' || type === 'boolean' || type === 'bigint') return value
    if (type === 'function' || type === 'symbol') return undefined
    if (depth > MAX_DEPTH || ancestors.includes(value) || isThenable(value)) return undefined
    if (value instanceof Date) return new Date(value.getTime())
    if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) return value
    if (value instanceof Error) {
      value = value.isAxiosError
        ? axiosErrorToPlain(value)
        : { ...value, name: value.name, message: value.message, stack: value.stack }
    } else if (typeof value.toJSON === 'function') {
      return clone(value.toJSON(), depth + 1)
    }

    ancestors.push(value)
    let result
    if (Array.isArray(value)) {
      result = value.map(item => clone(item, depth + 1))
    } else {
      result = {}
      Object.keys(value).forEach((key) => {
        const item = clone(value[key], depth + 1)
        if (item !== undefined) result[key] = item
      })
    }
    ancestors.pop()
    return result
  }

  return clone(input, 0)
}
