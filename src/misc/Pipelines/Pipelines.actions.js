import http from 'axios'
import { joinRoom, leaveRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'
import { push } from 'react-router-redux'
import { projectPipelineRoute } from 'route-actions'

export const getPipeline = ({ pipelineId }) => ({
  type: 'PIPELINES/GET_PIPELINE',
  payload: http({
    method: 'GET',
    url: `/api/v1/pipelines/${pipelineId}`,
    query: {
      populate: true,
    },
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
    query: {
      populate: true,
    },
  }),
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
    method: 'GET',
    url: `/api/v1/pipelines/${pipelineId}/restart`,    
    query: {
      populate: true,
    },
  }).then(newPipeline => dispatch(push(projectPipelineRoute({
    projectId: newPipeline.project._id,
    pipelineId: newPipeline._id,
  })))),
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
