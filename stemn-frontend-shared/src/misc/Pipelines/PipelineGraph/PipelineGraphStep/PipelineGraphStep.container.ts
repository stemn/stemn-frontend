import { connect } from 'react-redux'
import { selectStep } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraph.actions'
import { IPipelineGraphStoreState } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraph.reducer'
import { PipelineGraphStepComponent } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphStep/PipelineGraphStep'
import { PipelineGraphStepModel } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphStep/PipelineGraphStep.model'

const stateToProps = (
  { pipelineGraph }: { pipelineGraph: IPipelineGraphStoreState },
  { node }: { node: PipelineGraphStepModel },
) => ({
  isSelected: pipelineGraph.diagrams[node.parent.id].selectedStep === node.id,
  stepInfo: pipelineGraph.steps.find((step) => step.type === node.type),
})

const dispatchToProps = {
  selectStep,
}

export const PipelineGraphStep = connect(
  stateToProps,
  dispatchToProps,
)(PipelineGraphStepComponent)
