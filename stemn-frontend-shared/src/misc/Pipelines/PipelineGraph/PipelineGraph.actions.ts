export const initialiseModel = ({ diagramId, model }) => ({
  type: 'PIPELINE_DIAGRAM/INITIALISE_MODEL',
  payload: {
    diagramId,
    model,
  },
})

export const addStep = ({ diagramId, stepId, step }) => ({
  type: 'PIPELINE_DIAGRAM/ADD_STEP',
  payload: {
    diagramId,
    stepId,
    step,
  },
})

export const selectStep = ({ diagramId, stepId }) => ({
  type: 'PIPELINE_DIAGRAM/SELECT_STEP',
  payload: {
    diagramId,
    stepId,
  },
})
