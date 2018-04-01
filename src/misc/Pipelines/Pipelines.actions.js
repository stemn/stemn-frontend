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

export const getPipelines = ({ cacheKey }) => ({
  type: 'PIPELINES/GET_PIPELINES',
  payload: new Promise(resolve => resolve({
    data: [pipeline, {
      ...pipeline,
      _id: 'some-other-id',
    }],
  })),
  meta: {
    cacheKey,
  },
})

export const getStep = ({ stepId }) => ({
  type: 'PIPELINES/GET_STEP',
  payload: new Promise(resolve => resolve({
    data: pipeline.stages[0].steps[0],
  })),
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
