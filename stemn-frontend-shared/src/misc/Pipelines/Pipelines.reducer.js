import i from 'icepick'
import { flow, flatMap, map, keyBy } from 'lodash/fp'

const initialState = {
  lastPipelinesRequest: {
    cacheKey: undefined,
    projectId: undefined,
  },
  pipelines: {},
  pipelineData: {
    /*
      [pipelineId]: {
        data: {},
        loading: boolean,
        rerunPending: boolean,
        cancelPending: boolean,
      }
    */
  },
  stepData: {},
}

const replacePipelineStepsWithIds = pipeline => ({
  ...pipeline,
  stages: map(stage => ({
    ...stage,
    steps: map('_id', stage.steps),
  }), pipeline.stages),
})

const extractSteps = flow(
  flatMap('stages'),
  flatMap('steps'),
  map(item => ({
    loading: false,
    data: item,
  })),
  keyBy('data._id'),
)

const extractPipelines = flow(
  map(item => ({
    loading: false,
    data: replacePipelineStepsWithIds(item),          
  })),
  keyBy('data._id'),
)

const reducer = (state, action) => {
  switch (action.type) { 
    case 'PIPELINES/GET_PIPELINES_PENDING':
      return i.chain(state)
        .assocIn(['pipelines', action.meta.cacheKey, 'loading'], true)
        .assocIn(['lastPipelinesRequest'], {
          cacheKey: action.meta.cacheKey,
          projectId: action.meta.projectId,
        })
        .value()
    case 'PIPELINES/GET_PIPELINES_REJECTED':
      return i.assocIn(state, ['pipelines', action.meta.cacheKey, 'loading'], false)
    case 'PIPELINES/GET_PIPELINES_FULFILLED':
      return i.chain(state)
        .assocIn(['pipelines', action.meta.cacheKey, 'loading'], false)
        .assocIn(['pipelines', action.meta.cacheKey, 'data'], action.payload.data.map(item => item._id))
        .updateIn(['pipelineData'], data => i.merge(data, extractPipelines(action.payload.data)))
        .updateIn(['stepData'], data => i.merge(data, extractSteps(action.payload.data)))
        .value()

    case 'PIPELINES/GET_PIPELINE_PENDING':
      return i.assocIn(state, ['pipelineData', action.meta.cacheKey, 'loading'], true)
    case 'PIPELINES/GET_PIPELINE_REJECTED':
      return i.assocIn(state, ['pipelineData', action.meta.cacheKey, 'loading'], false)
    case 'PIPELINES/GET_PIPELINE_FULFILLED':
      return i.chain(state)
        .updateIn(['pipelineData'], data => i.merge(data, extractPipelines([action.payload.data])))
        .updateIn(['stepData'], data => i.merge(data, extractSteps([action.payload.data])))
        .value()
        
    case 'PIPELINES/RERUN_PIPELINE_PENDING':
      return i.assocIn(state, ['pipelineData', action.meta.pipelineId, 'rerunPending'], true)
    case 'PIPELINES/RERUN_PIPELINE_REJECTED':
      return i.assocIn(state, ['pipelineData', action.meta.pipelineId, 'rerunPending'], false)
    case 'PPIPELINES/RERUN_PIPELINE_FULFILLED':
      return i.assocIn(state, ['pipelineData', action.meta.pipelineId, 'rerunPending'], false)
      
    case 'PIPELINES/CANCEL_PIPELINE_PENDING':
      return i.assocIn(state, ['pipelineData', action.meta.pipelineId, 'cancelPending'], true)
    case 'PIPELINES/CANCEL_PIPELINE_REJECTED':
      return i.assocIn(state, ['pipelineData', action.meta.pipelineId, 'cancelPending'], false)
    case 'PIPELINES/CANCEL_PIPELINE_FULFILLED':
      return i.assocIn(state, ['pipelineData', action.meta.pipelineId, 'cancelPending'], false)

    case 'PIPELINES/GET_STEP_PENDING':
      return i.assocIn(state, ['stepData', action.meta.cacheKey, 'loading'], true)
    case 'PIPELINES/GET_STEP_REJECTED':
      return i.assocIn(state, ['stepData', action.meta.cacheKey, 'loading'], false)
    case 'PIPELINES/GET_STEP_FULFILLED':
      return i.chain(state)
        .assocIn(['stepData', action.payload.data._id, 'loading'], false)
        .assocIn(['stepData', action.payload.data._id, 'data'], action.payload.data)
        .value()

    default:
      return state
  }
}

export default (state = initialState, action) => {
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true }
  }
  return reducer(state, action)
}
