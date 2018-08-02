import { get } from 'lodash'
import { connect } from 'react-redux'
import { IPipelineGraphStoreState } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraph.reducer'
import { PipelineGraphSidebarComponent } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphSidebar/PipelineGraphSidebar'

const stateToProps = (
  { pipelineGraph }: { pipelineGraph: IPipelineGraphStoreState },
  { diagramId }: { diagramId: string },
) => {
  const diagram = pipelineGraph.diagrams[diagramId] || {}
  return {
    diagram,
    selectedStep: get(diagram, ['model', 'steps', diagram.selectedStep]),
    steps: pipelineGraph.steps,
  }
}

const dispatchToProps = {}

export const PipelineGraphSidebar = connect(stateToProps, dispatchToProps)(PipelineGraphSidebarComponent)
