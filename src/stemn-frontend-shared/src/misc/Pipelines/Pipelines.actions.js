import http from 'axios'
import { joinRoom, leaveRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'
import { push } from 'react-router-redux'
import { projectPipelineRoute } from 'route-actions'

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

export const getPipelines = ({ projectId, cacheKey, page, size, criteria }) => ({
  type: 'PIPELINES/GET_PIPELINES',
  http: true,
  payload: {
    method: 'GET',
    url: `/api/v1/projects/${projectId}/pipelines`,
    params: {
      page,
      size,
      criteria,
    },
  },
  throttle: {
    time: 500,
    endpoint: 'get-pipelines',
  },
  meta: {
    cacheKey,
    projectId,
  },
})

export const getLastPipelines = () => (dispatch, getState) => {
  const { projectId, cacheKey } = getState().pipelines.lastPipelinesRequest
  return projectId && cacheKey && dispatch(getPipelines({ projectId, cacheKey }))
}

export const rerunPipeline = ({ pipelineId }) => dispatch => dispatch({
  type: 'PIPELINES/RERUN_PIPELINE',
  payload: http({
    method: 'POST',
    url: `/api/v1/pipelines/${pipelineId}/restart`,    
  }).then(({ data: newPipeline }) => dispatch(push(projectPipelineRoute({
    projectId: newPipeline.project._id,
    pipelineId: newPipeline._id,
  })))),
  meta: {
    pipelineId,
  },
})

export const cancelPipeline = ({ pipelineId }) => ({
  type: 'PIPELINES/CANCEL_PIPELINE',
  payload: http({
    method: 'POST',
    url: `/api/v1/pipelines/${pipelineId}/cancel`,    
  }),
  meta: {
    pipelineId,
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
