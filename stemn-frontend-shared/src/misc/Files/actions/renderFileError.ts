import type { IRenderError } from './types'

export interface IRenderFileErrorAction {
  type: 'FILES/RENDER_FILE_REJECTED'
  payload: IRenderError
  meta: { cacheKey: string }
}

/** A render failed (RENDER/RENDER_FAILED websocket event) */
export const renderFileError = ({
  fileId,
  revisionId,
  error,
}: {
  fileId: string
  revisionId: string
  error: string
}): IRenderFileErrorAction => {
  const cacheKey = `${fileId}-${revisionId}`
  return {
    type: 'FILES/RENDER_FILE_REJECTED',
    payload: {
      response: {
        data: {
          error,
        },
      },
    },
    meta: {
      cacheKey,
    },
  }
}
