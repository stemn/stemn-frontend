import { connect } from 'react-redux'
import { PipelineGraphComponent } from './PipelineGraph'
import { initialiseModel, addStep, selectStep } from './PipelineGraph.actions'
import { IPipelineGraphStoreState } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraph.reducer'

const stateToProps = (
  { pipelineGraph }: { pipelineGraph: IPipelineGraphStoreState }, 
  { diagramId }: { diagramId: string }
) => ({
  diagram: pipelineGraph[diagramId],
})

const dispatchToProps = {
  initialiseModel,
  addStep,
  selectStep,
}

export const PipelineGraph = connect(stateToProps, dispatchToProps)(PipelineGraphComponent)
