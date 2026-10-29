export interface IRenderFileProgressAction {
  type: 'FILES/RENDER_FILE_PROGRESS'
  payload: { message: string }
  meta: { cacheKey: string }
}

/** Render progress (RENDER/RENDER_PROGRESS websocket event); the render id is the cache key */
export const renderFileProgress = ({
  renderId,
  message,
}: {
  renderId: string
  message: string
}): IRenderFileProgressAction => {
  const cacheKey = renderId
  return {
    type: 'FILES/RENDER_FILE_PROGRESS',
    payload: {
      message,
    },
    meta: {
      cacheKey,
    },
  }
}
