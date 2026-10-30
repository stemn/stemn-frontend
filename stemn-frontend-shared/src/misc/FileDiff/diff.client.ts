import { onDiffEvent } from './diff.events'
import type { IDiffError, IDiffManifest, IDiffPending } from './diff.types'
import { diffUrl } from './diff.utils'

export interface IDiffRequest {
  projectId: string
  fileId: string
  /** The older revision */
  revisionA: string
  /** The newer revision */
  revisionB: string
  token?: string | null
  /** Where the API sends DIFF/DIFF_COMPLETE besides the user's own room */
  roomId?: string
  force?: boolean
}

/** A diff the API refused or could not compute: `error.type` is DIFF_NOT_SUPPORTED, DIFF_FAILED, REVISION_NOT_FOUND, ... */
export class DiffRequestError extends Error {
  public error: IDiffError
  constructor(error: IDiffError) {
    super(error.message)
    this.error = error
  }
}

/** One request to the diff route: the manifest, or `{ status: 'pending' }` while a revision is being converted */
export const fetchDiff = async ({
  token,
  roomId,
  force,
  ...revisions
}: IDiffRequest): Promise<IDiffManifest | IDiffPending> => {
  const query = new URLSearchParams()
  if (roomId) query.set('roomId', roomId)
  if (force) query.set('force', 'true')
  const response = await fetch(`${diffUrl(revisions)}${query.size ? `?${query}` : ''}`, {
    headers: token ? { Authorization: `bearer ${token}` } : {},
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new DiffRequestError(
      body && body.error && body.error.type
        ? body.error
        : { code: response.status, type: 'DIFF_FAILED', message: `The diff could not be loaded (${response.status}).` },
    )
  }
  return body
}

const sameDiff = (request: IDiffRequest, payload: { fileId: string; revisionA: string; revisionB: string }) =>
  payload.fileId === request.fileId &&
  payload.revisionA === request.revisionA &&
  payload.revisionB === request.revisionB

/**
 * The manifest of a diff, waiting while it is pending: asks again when the API sends DIFF/DIFF_COMPLETE (or
 * DIFF/DIFF_FAILED), and every `pollInterval` ms in case the websocket is not connected. Rejects with a
 * DiffRequestError, or when the signal aborts.
 */
export const loadDiff = (
  request: IDiffRequest,
  {
    signal,
    onPending,
    pollInterval = 3000,
  }: { signal?: AbortSignal; onPending?: () => void; pollInterval?: number } = {},
): Promise<IDiffManifest> =>
  new Promise((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let settled = false
    const finish = (callback: () => void) => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      unsubscribe()
      signal?.removeEventListener('abort', abort)
      callback()
    }
    const abort = () => finish(() => reject(new DOMException('The diff request was aborted', 'AbortError')))
    const ask = () => {
      if (timer) clearTimeout(timer)
      fetchDiff(request).then(
        (response) => {
          if (settled) return
          if (response.status === 'complete') return finish(() => resolve(response))
          onPending?.()
          timer = setTimeout(ask, pollInterval)
        },
        (error) => finish(() => reject(error)),
      )
    }
    const unsubscribe = onDiffEvent((event) => {
      if (settled || !sameDiff(request, event.payload)) return
      if (event.type === 'failed') finish(() => reject(new DiffRequestError(event.payload.error)))
      else ask()
    })
    if (signal?.aborted) return abort()
    signal?.addEventListener('abort', abort)
    ask()
  })
