import { connect } from 'react-redux'
import { PipelineGraphComponent } from './PipelineGraph'
import { initialiseModel, addStep, selectStep } from './PipelineGraph.actions'

const stateToProps = ({ pipelineGraph }, { diagramId }) => ({
  diagram: pipelineGraph[diagramId] || {},
})

const dispatchToProps = {
  initialiseModel,
  addStep,
  selectStep,
}

export const PipelineGraph = connect(stateToProps, dispatchToProps)(PipelineGraphComponent)
