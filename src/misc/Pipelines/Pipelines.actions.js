import http from 'axios'
import { pipeline } from './Pipeline.data'
import { joinRoom, leaveRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'

export const getPipeline = ({ pipelineId }) => ({
  type: 'PIPELINES/GET_PIPELINE',
  payload: http({
    method: 'GET',
    url: `/api/v1/pipelines/${pipelineId}`,
  }),
  meta: {
    cacheKey: pipelineId,
  },
})

export const getPipelines = ({ projectId, cacheKey }) => ({
  type: 'PIPELINES/GET_PIPELINES',
  payload: http({
    method: 'GET',
    url: `/api/v1/projects/${projectId}/pipelines`,
  }),
  meta: {
    cacheKey,
  },
})

export const getStep = ({ stepId }) => ({
  type: 'PIPELINES/GET_STEP',
  payload: http({
    method: 'GET',
    url: `/api/v1/steps/${stepId}`,
  }),
})

export const joinPipelineRoom = ({ pipelineId }) => joinRoom({
  room: pipelineId,
  type: 'pipeline',
})

export const leavePipelineRoom = ({ pipelineId }) => leaveRoom({
  room: pipelineId,
  type: 'pipeline',
})

export const joinStepRoom = ({ stepId }) => joinRoom({
  room: stepId,
  type: 'step',
})

export const leaveStepRoom = ({ stepId }) => leaveRoom({
  room: stepId,
  type: 'step',
})
