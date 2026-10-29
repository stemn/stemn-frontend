import { produce } from 'immer'
import { flow, flatMap, map, keyBy } from 'lodash/fp'
import { mergeDeep, setIn } from 'stemn-shared/redux/draft'

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

const replacePipelineStepsWithIds = (pipeline) => ({
  ...pipeline,
  stages: map(
    (stage) => ({
      ...stage,
      steps: map('_id', stage.steps),
    }),
    pipeline.stages,
  ),
})

const extractSteps = flow(
  flatMap('stages'),
  flatMap('steps'),
  map((item) => ({
    loading: false,
    data: item,
  })),
  keyBy('data._id'),
)

const extractPipelines = flow(
  map((item) => ({
    loading: false,
    data: replacePipelineStepsWithIds(item),
  })),
  keyBy('data._id'),
)

const reducer = (state, action) => {
  switch (action.type) {
    case 'PIPELINES/GET_PIPELINES_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['pipelines', action.meta.cacheKey, 'loading'], true)
        draft.lastPipelinesRequest = { cacheKey: action.meta.cacheKey, projectId: action.meta.projectId }
      })
    case 'PIPELINES/GET_PIPELINES_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['pipelines', action.meta.cacheKey, 'loading'], false)
      })
    case 'PIPELINES/GET_PIPELINES_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['pipelines', action.meta.cacheKey, 'loading'], false)
        setIn(
          draft,
          ['pipelines', action.meta.cacheKey, 'data'],
          action.payload.data.map((item) => item._id),
        )
        mergeDeep(draft.pipelineData, extractPipelines(action.payload.data))
        mergeDeep(draft.stepData, extractSteps(action.payload.data))
      })

    case 'PIPELINES/GET_PIPELINE_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['pipelineData', action.meta.cacheKey, 'loading'], true)
      })
    case 'PIPELINES/GET_PIPELINE_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['pipelineData', action.meta.cacheKey, 'loading'], false)
      })
    case 'PIPELINES/GET_PIPELINE_FULFILLED':
      return produce(state, (draft) => {
        mergeDeep(draft.pipelineData, extractPipelines([action.payload.data]))
        mergeDeep(draft.stepData, extractSteps([action.payload.data]))
      })

    case 'PIPELINES/RERUN_PIPELINE_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['pipelineData', action.meta.pipelineId, 'rerunPending'], true)
      })
    case 'PIPELINES/RERUN_PIPELINE_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['pipelineData', action.meta.pipelineId, 'rerunPending'], false)
      })
    case 'PPIPELINES/RERUN_PIPELINE_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['pipelineData', action.meta.pipelineId, 'rerunPending'], false)
      })

    case 'PIPELINES/CANCEL_PIPELINE_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['pipelineData', action.meta.pipelineId, 'cancelPending'], true)
      })
    case 'PIPELINES/CANCEL_PIPELINE_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['pipelineData', action.meta.pipelineId, 'cancelPending'], false)
      })
    case 'PIPELINES/CANCEL_PIPELINE_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['pipelineData', action.meta.pipelineId, 'cancelPending'], false)
      })

    case 'PIPELINES/GET_STEP_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['stepData', action.meta.cacheKey, 'loading'], true)
      })
    case 'PIPELINES/GET_STEP_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['stepData', action.meta.cacheKey, 'loading'], false)
      })
    case 'PIPELINES/GET_STEP_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['stepData', action.payload.data._id, 'loading'], false)
        setIn(draft, ['stepData', action.payload.data._id, 'data'], action.payload.data)
      })

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
