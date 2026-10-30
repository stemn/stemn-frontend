/**
 * Batches single-entity reads into the API's list routes (`GET /api/v1/threads?ids[]=a&ids[]=b`), like
 * the httpPackage middleware does for the Redux actions: every `load(id)` made within `wait` ms goes
 * out as one request, and a batch is sent as soon as it holds `maxSize` ids (the API parses query
 * strings with qs, which turns more than 20 `ids[]` into an object and fails validation).
 *
 * The list routes answer a missing or forbidden id with `{ _id, error: 'Not Found' }` in its place;
 * that id's `load` rejects with an ApiError (404), the others resolve.
 */
import { ApiError, parseErrorBody } from './errors'

export interface IBatcherOptions<Item> {
  /** Fetches the items for the ids (one request) */
  fetchMany: (ids: string[]) => Promise<Item[]>
  /** Defaults to `item._id` */
  getId?: (item: Item) => string | undefined
  wait?: number
  maxSize?: number
}

export interface IBatcher<Item> {
  load: (id: string) => Promise<Item>
}

interface IPending<Item> {
  resolve: (item: Item) => void
  reject: (error: unknown) => void
}

const defaultGetId = (item: unknown) =>
  item && typeof item === 'object' && '_id' in item && typeof item._id === 'string' ? item._id : undefined

const itemError = (item: unknown) =>
  item && typeof item === 'object' && 'error' in item && item.error ? parseErrorBody(item) : undefined

// A function declaration, not a generic arrow: the webpack fallback's Babel parses `<T>(` in .ts as JSX
export function createBatcher<Item>({
  fetchMany,
  getId = defaultGetId,
  wait = 20,
  maxSize = 20,
}: IBatcherOptions<Item>): IBatcher<Item> {
  let queue = new Map<string, IPending<Item>[]>()
  let timer: ReturnType<typeof setTimeout> | undefined

  const flush = () => {
    const batch = queue
    queue = new Map()
    if (timer) clearTimeout(timer)
    timer = undefined
    const ids = [...batch.keys()]

    fetchMany(ids).then(
      (items) => {
        const byId = new Map<string, Item>()
        items.forEach((item) => {
          const id = getId(item)
          if (id && !byId.has(id)) byId.set(id, item)
        })
        batch.forEach((waiting, id) => {
          const item = byId.get(id)
          const error = item === undefined ? { message: 'Not Found' } : itemError(item)
          waiting.forEach(({ resolve, reject }) =>
            error
              ? reject(
                  new ApiError({
                    status: 404,
                    type: 'ENTITY_NOT_FOUND',
                    message: error.message || 'Not Found',
                    data: { id },
                  }),
                )
              : resolve(item as Item),
          )
        })
      },
      (error) => batch.forEach((waiting) => waiting.forEach(({ reject }) => reject(error))),
    )
  }

  return {
    load: (id) =>
      new Promise<Item>((resolve, reject) => {
        const waiting = queue.get(id)
        if (waiting) waiting.push({ resolve, reject })
        else queue.set(id, [{ resolve, reject }])
        if (queue.size >= maxSize) flush()
        else if (!timer) timer = setTimeout(flush, wait)
      }),
  }
}
