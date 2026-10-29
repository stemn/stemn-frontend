import { isDraft } from 'immer'

/**
 * Helpers for immer drafts with the semantics of the immutable `assocIn` / `merge` the reducers were written
 * against. They mutate the draft passed in; use them inside `produce(state, (draft) => { ... })`.
 */

type Path = ReadonlyArray<string | number>

const shallowCopy = (value: any) => (Array.isArray(value) ? [...value] : { ...value })

// Only plain objects and arrays are merged recursively (not class instances such as Error or Date)
const isPlainCollection = (value: unknown): value is Record<string, any> => {
  if (value === null || typeof value !== 'object') return false
  if (Array.isArray(value)) return true
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * Set `value` at `path` (`assocIn`). Missing (falsy) intermediates are created as `{}`; intermediates that are
 * not drafts (class instances, or objects assigned earlier in the same recipe such as action payloads) are
 * shallow-copied instead of being mutated.
 * Assigning the value already there, or `undefined` to a missing key, leaves the draft untouched.
 */
export const setIn = (draft: any, path: Path, value: unknown): void => {
  let node = draft
  for (let index = 0; index < path.length - 1; index += 1) {
    const key = path[index]
    const child = node[key]
    if (!child) {
      node[key] = {}
    } else if (!isDraft(child)) {
      node[key] = shallowCopy(child)
    }
    node = node[key]
  }
  const lastKey = path[path.length - 1]
  if (value === undefined && node[lastKey] === undefined) return
  node[lastKey] = value
}

/**
 * Deep-merge `source` into `draft`: plain objects are merged key by key, arrays and every other value replace
 * the target value (source objects are assigned, not copied). A `null`/`undefined` draft or source is a no-op.
 */
export const mergeDeep = (draft: any, source: any): void => {
  if (draft == null || source == null) return
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key]
    const targetValue = draft[key]
    if (!Array.isArray(sourceValue) && isPlainCollection(sourceValue) && isPlainCollection(targetValue)) {
      // Objects assigned earlier in the recipe are not drafts: copy them rather than mutating them
      if (!isDraft(targetValue)) draft[key] = shallowCopy(targetValue)
      mergeDeep(draft[key], sourceValue)
    } else if (targetValue !== sourceValue) {
      draft[key] = sourceValue
    }
  })
}
