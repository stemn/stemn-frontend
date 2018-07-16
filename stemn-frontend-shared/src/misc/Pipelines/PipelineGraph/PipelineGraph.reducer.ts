import * as i from 'icepick'
import { IPipelineConfig } from 'stemn-shared/misc/Pipelines/PipelineGraph/types'

export interface IPipelineGraphStoreState {
  diagrams: {
    [diagramId: string]: {
      selectedStep: string,
      model: IPipelineConfig,
    },
  },
}

const initialState: IPipelineGraphStoreState = {
  diagrams: {},
}

export default (state: IPipelineGraphStoreState = initialState, action) => {
  switch (action.type) {
    case 'PIPELINE_DIAGRAM/INITIALISE_MODEL':
      return i.assocIn(state, ['diagrams', action.payload.diagramId, 'model'], action.payload.model)

    case 'PIPELINE_DIAGRAM/SELECT_STEP':
      return i.assocIn(state, ['diagrams', action.payload.diagramId, 'selectedStep'], action.payload.stepId)

    case 'PIPELINE_DIAGRAM/ADD_STEP':
      return i.assocIn(state, ['diagrams', action.payload.diagramId, 'model', 'steps', action.payload.stepId], action.payload.step)

    default:
      return state
  }
}
