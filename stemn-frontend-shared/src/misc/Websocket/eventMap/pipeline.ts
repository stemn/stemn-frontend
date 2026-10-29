import { addLines } from 'stemn-shared/misc/Terminal/Terminal.actions'
import { getPipeline, getStep, getLastPipelines } from 'stemn-shared/misc/Pipelines/Pipelines.actions'
import type { SocketEventHandler } from './types'

const pipelineEvents: SocketEventHandler = (store, action) => {
  const { dispatch } = store

  switch (action.type) {
    case 'PIPELINE/STEP_LOGS':
      return dispatch(
        addLines({
          // @ts-expect-error -- pre-existing bug, kept as is: addLines reads `stepId`, not `terminalId`, so the
          // live logs are stored under `lines.undefined`. Fix: `stepId: action.payload.stepId` (see docs/TYPESCRIPT.md)
          terminalId: `${action.payload.pipelineId}-${action.payload.stepId}`,
          lines: action.payload.lines,
        }),
      )

    case 'PIPELINE/STEP_UPDATED':
      return dispatch(
        getStep({
          stepId: action.payload.stepId,
        }),
      )

    case 'PIPELINE/PIPELINE_UPDATED':
      return dispatch(
        getPipeline({
          pipelineId: action.payload.pipelineId,
        }),
      )

    case 'PIPELINE/PIPELINE_CREATED':
      return dispatch(getLastPipelines())

    default:
      return undefined
  }
}

export default pipelineEvents
