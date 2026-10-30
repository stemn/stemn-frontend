import type { IDiffCompleteEvent, IDiffFailedEvent } from './diff.types'

/**
 * DIFF/DIFF_COMPLETE and DIFF/DIFF_FAILED from the websocket (Websocket/eventMap/diff.js), for the diff views waiting on a
 * pending diff. A plain subscription rather than a reducer: only an open diff view cares, and it refetches the manifest.
 */
export type IDiffEvent =
  { type: 'complete'; payload: IDiffCompleteEvent } | { type: 'failed'; payload: IDiffFailedEvent }

type IDiffListener = (event: IDiffEvent) => void

const listeners = new Set<IDiffListener>()

/** Calls the listener on every diff event until the returned function is called */
export const onDiffEvent = (listener: IDiffListener) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const emitDiffEvent = (event: IDiffEvent) => listeners.forEach((listener) => listener(event))
