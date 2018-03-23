import { pipeline } from './Pipeline.data'

export const getPipeline = ({ pipelineId }) => ({
  type: 'PIPELINES/GET_PIPELINE',
  payload: new Promise(resolve => resolve({
    data: pipeline,
  })),
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

export const getStep = ({ cacheKey }) => ({
  type: 'PIPELINES/GET_STEP',
  payload: new Promise(resolve => resolve({
    data: pipeline.stages[0].steps[0],
  })),
  meta: {
    cacheKey,
  },
})