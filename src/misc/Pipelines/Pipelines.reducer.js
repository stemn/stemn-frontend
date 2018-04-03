import i from 'icepick'
import { flow, flatMap, map, keyBy } from 'lodash/fp'

const initialState = {
  pipelines: {},
  pipelineData: {},
  stepData: {},
}

const reducer = (state, action) => {
  switch (action.type) { 
    case 'PIPELINES/GET_PIPELINES_PENDING':
      return i.assocIn(state, ['pipelines', action.meta.cacheKey, 'loading'], true)
    case 'PIPELINES/GET_PIPELINES_REJECTED':
      return i.assocIn(state, ['pipelines', action.meta.cacheKey, 'loading'], false)
    case 'PIPELINES/GET_PIPELINES_FULFILLED':
      return i.chain(state)
        .assocIn(['pipelines', action.meta.cacheKey, 'loading'], false)
        .assocIn(['pipelines', action.meta.cacheKey, 'data'], action.payload.data.map(item => item._id))
        .updateIn(['pipelineData'], data => i.merge(data, flow(
          map(item => ({
            loading: false,
            data: {
              ...item,
              stages: map(stage => ({
                ...stage,
                steps: map('_id', stage.steps),
              }), item.stages),
              project: {
                _id: '5ab63ec82cea660019476793',
              },
              pipelineNumber: '43',
              user: {
                _id: '547db55af7f342380174e228',
                name: 'David Revay',
                picture: '/uploads/2b4ae5ac-e869-4a7d-8b99-4de21d852a8a.jpg',
              },
            },          
          })),
          keyBy('data._id'),
        )(action.payload.data)))
        .updateIn(['stepData'], data => i.merge(data, flow(
          flatMap('stages'),
          flatMap('steps'),
          map(item => ({
            loading: false,
            data: item,
          })),
          keyBy('data._id'),
        )(action.payload.data)))
        .value()

    case 'PIPELINES/GET_PIPELINE_PENDING':
      return i.assocIn(state, ['pipelineData', action.meta.cacheKey, 'loading'], true)
    case 'PIPELINES/GET_PIPELINE_REJECTED':
      return i.assocIn(state, ['pipelineData', action.meta.cacheKey, 'loading'], false)
    case 'PIPELINES/GET_PIPELINE_FULFILLED':
      return i.chain(state)
        .assocIn(['pipelineData', action.meta.cacheKey, 'loading'], false)
        .assocIn(['pipelineData', action.meta.cacheKey, 'data'], {
          ...action.payload.data,
          user: {
            _id: 'abc',
            name: 'David Revay',
          },
          project: {
            _id: '5a88ff3f236712000f83bbd8',
          },
        })
        .value()

    case 'PIPELINES/GET_STEP_PENDING':
      return i.assocIn(state, ['stepData', action.meta.cacheKey, 'loading'], true)
    case 'PIPELINES/GET_STEP_REJECTED':
      return i.assocIn(state, ['stepData', action.meta.cacheKey, 'loading'], false)
    case 'PIPELINES/GET_STEP_FULFILLED':
      return i.chain(state)
        .assocIn(['stepData', action.meta.cacheKey, 'loading'], false)
        .assocIn(['stepData', action.meta.cacheKey, 'data'], action.payload.data)
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
