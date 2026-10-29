/**
 * In-order delivery for the messages between the windows and the core store.
 *
 * Electron IPC delivers messages in order. Tauri IPC requests are independent (one request per
 * message), so each sender numbers its messages (`seq`, from 1) and the receiver delivers them in
 * that order. A missing number is waited for `gapTimeout` ms and then skipped, so one slow or lost
 * message can't stall a window; if it turns up later it is still delivered (late rather than never).
 * A sender that restarts (a reloaded window) uses a new `session`.
 */
export interface Sequenced {
  seq: number
  session?: string
}

export interface Sequencer<T extends Sequenced> {
  /** Accept a message from a sender (one Sequencer per sender) */
  push: (message: T) => void
  /** Deliver everything up to and including `seq` as already seen (e.g. contained in a state snapshot) */
  skipThrough: (seq: number) => void
  /** Expect `nextSeq` next from `session` (e.g. after a state snapshot that contains everything before it) */
  reset: (session: string | undefined, nextSeq: number) => void
  /** Messages waiting for a missing predecessor */
  pending: () => number
}

export const createSequencer = <T extends Sequenced>({
  deliver,
  onGap,
  gapTimeout = 500,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
}: {
  deliver: (message: T) => void
  /** Called with the numbers given up on after `gapTimeout` */
  onGap?: (missing: number[]) => void
  gapTimeout?: number
  setTimer?: (fn: () => void, ms: number) => unknown
  clearTimer?: (timer: any) => void
}): Sequencer<T> => {
  let expected = 1
  let session: string | undefined
  const buffer = new Map<number, T>()
  /** numbers given up on that may still arrive */
  const skipped = new Set<number>()
  let timer: unknown

  const drain = () => {
    while (buffer.has(expected)) {
      const message = buffer.get(expected)!
      buffer.delete(expected)
      expected += 1
      deliver(message)
    }
    if (timer !== undefined) {
      clearTimer(timer)
      timer = undefined
    }
    if (buffer.size > 0) {
      timer = setTimer(() => {
        timer = undefined
        // give up on the gap: continue with the oldest buffered message
        const next = Math.min(...buffer.keys())
        const missing: number[] = []
        for (let seq = expected; seq < next; seq += 1) {
          skipped.add(seq)
          missing.push(seq)
        }
        if (skipped.size > 10_000) skipped.clear()
        onGap?.(missing)
        expected = next
        drain()
      }, gapTimeout)
    }
  }

  return {
    push: (message) => {
      if (message.session !== undefined && message.session !== session) {
        // first message of this sender, or a reloaded sender: start over
        session = message.session
        expected = message.seq
        buffer.clear()
        skipped.clear()
      }
      if (message.seq < expected) {
        // a message given up on arrives late: deliver it; anything else is a duplicate
        if (skipped.delete(message.seq)) deliver(message)
        return
      }
      buffer.set(message.seq, message)
      drain()
    },
    skipThrough: (seq) => {
      for (const key of [...buffer.keys()]) if (key <= seq) buffer.delete(key)
      expected = Math.max(expected, seq + 1)
      drain()
    },
    reset: (newSession, nextSeq) => {
      if (newSession !== session) skipped.clear()
      session = newSession
      expected = nextSeq
      for (const key of [...buffer.keys()]) if (key < nextSeq) buffer.delete(key)
      drain()
    },
    pending: () => buffer.size,
  }
}
