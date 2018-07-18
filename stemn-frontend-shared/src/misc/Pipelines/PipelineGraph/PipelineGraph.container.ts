import { connect } from 'react-redux'
import { PipelineGraphComponent } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraph'
import { addStep, initialiseModel, selectStep } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraph.actions'
import { IPipelineGraphStoreState } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraph.reducer'

const stateToProps = (
  { pipelineGraph }: { pipelineGraph: IPipelineGraphStoreState },
  { diagramId }: { diagramId: string },
) => ({
  diagram: pipelineGraph.diagrams[diagramId],
  steps: pipelineGraph.steps,
})

const dispatchToProps = {
  initialiseModel,
  addStep,
  selectStep,
}

export const PipelineGraph = connect(stateToProps, dispatchToProps)(PipelineGraphComponent)
