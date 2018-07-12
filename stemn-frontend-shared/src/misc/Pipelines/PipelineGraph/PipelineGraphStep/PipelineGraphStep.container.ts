import { connect } from 'react-redux'
import { PipelineGraphStepComponent } from './PipelineGraphStep'

const stateToProps = ({ pipelineGraph }, { node }) => ({
  isSelected: pipelineGraph[node.parent.id].selectedStep === node.id
})

const dispatchToProps = {}

export const PipelineGraphStep = connect(stateToProps, dispatchToProps)(PipelineGraphStepComponent)
