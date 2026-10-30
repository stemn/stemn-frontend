/**
 * "Do not install while a commit is in flight" (pure, unit-tested in tests/unit/updater.test.ts).
 *
 * A commit is a CHANGES/COMMIT promise action dispatched in a renderer: its _PENDING and
 * _FULFILLED / _REJECTED actions are reduced by the main store, where the AutoUpdate reducer keeps
 * `autoUpdate.pendingCommits` ({ [projectId]: true }). The guard remembers when it first saw each
 * pending commit so that a commit whose renderer died mid-request (no _FULFILLED/_REJECTED ever
 * arrives) stops blocking updates after `staleAfterMs`.
 */
export const COMMIT_STALE_AFTER_MS = 15 * 60 * 1000

export const createCommitGuard = ({ now = Date.now, staleAfterMs = COMMIT_STALE_AFTER_MS } = {}) => {
  const firstSeen = new Map()

  /** Call with every new main-store state */
  const observe = (state) => {
    const pending = (state && state.autoUpdate && state.autoUpdate.pendingCommits) || {}
    const ids = Object.keys(pending).filter((id) => pending[id])
    ids.forEach((id) => {
      if (!firstSeen.has(id)) firstSeen.set(id, now())
    })
    ;[...firstSeen.keys()].filter((id) => !ids.includes(id)).forEach((id) => firstSeen.delete(id))
  }

  /** Project ids with a commit in flight (stale ones excluded) */
  const pendingCommits = (state) => {
    observe(state)
    const time = now()
    return [...firstSeen.entries()].filter(([, since]) => time - since < staleAfterMs).map(([id]) => id)
  }

  /** Project ids whose commit has been pending for longer than staleAfterMs */
  const staleCommits = (state) => {
    observe(state)
    const time = now()
    return [...firstSeen.entries()].filter(([, since]) => time - since >= staleAfterMs).map(([id]) => id)
  }

  return { observe, pendingCommits, staleCommits }
}
