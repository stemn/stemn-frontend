/**
 * Loads a diff for a viewer: the manifest from the API (waiting while the revisions are converted), then the viewer's
 * own renders of both revisions (glbs, SVGs). DIFF_NOT_SUPPORTED becomes 'unsupported', so the viewer can fall back to
 * the plain side-by-side comparison.
 */
import * as React from 'react'
import { DiffRequestError, loadDiff } from '../diff.client'
import type { IDiffError, IDiffManifest } from '../diff.types'

export type IDiffLoadState<T> =
  | { status: 'loading' | 'pending' }
  | ({ status: 'ready'; manifest: IDiffManifest } & T)
  | { status: 'unsupported' | 'error'; error: IDiffError }

export const useDiffLoad = <T extends object>({
  projectId,
  fileId,
  revisionA,
  revisionB,
  token,
  loadRenders,
}: {
  projectId: string
  fileId: string
  revisionA: string
  revisionB: string
  token?: string | null
  /** The renders of A and B the viewer draws, once the manifest is there */
  loadRenders: (manifest: IDiffManifest, signal: AbortSignal) => Promise<T>
}) => {
  const [load, setLoad] = React.useState<IDiffLoadState<T>>({ status: 'loading' })
  const loadRendersRef = React.useRef(loadRenders)
  loadRendersRef.current = loadRenders

  React.useEffect(() => {
    const controller = new AbortController()
    const request = { projectId, fileId, revisionA, revisionB, token, roomId: `${fileId}-${revisionA}-${revisionB}` }
    loadDiff(request, { signal: controller.signal, onPending: () => setLoad({ status: 'pending' }) })
      .then(async (manifest) => {
        const renders = await loadRendersRef.current(manifest, controller.signal)
        if (controller.signal.aborted) return
        setLoad({ status: 'ready', manifest, ...renders })
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        const diffError: IDiffError =
          error instanceof DiffRequestError ? error.error : { type: 'DIFF_FAILED', message: error.message }
        setLoad({ status: diffError.type === 'DIFF_NOT_SUPPORTED' ? 'unsupported' : 'error', error: diffError })
      })
    return () => controller.abort()
  }, [projectId, fileId, revisionA, revisionB, token])

  return load
}
