import { get } from 'lodash'
import { connect } from 'react-redux'
import { PipelineGraphSidebarComponent } from './PipelineGraphSidebar'
import { IPipelineGraphStoreState } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraph.reducer'

const stateToProps = (
  { pipelineGraph }: { pipelineGraph: IPipelineGraphStoreState }, 
  { diagramId }: { diagramId: string }
) => {
  const diagram = pipelineGraph[diagramId] || {}
  return {
    diagram: pipelineGraph[diagramId] || {},
    selectedStep: get(diagram, ['model', 'steps', diagram.selectedStep]),
  }
}

const dispatchToProps = {}

export const PipelineGraphSidebar = connect(stateToProps, dispatchToProps)(PipelineGraphSidebarComponent)
