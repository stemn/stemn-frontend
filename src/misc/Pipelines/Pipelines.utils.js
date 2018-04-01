import { flatMap, flow, find } from 'lodash/fp'

export const findStep = (stages, stepId) => flow(
  flatMap('steps'),
  find(step => step._id === stepId),
)(stages)