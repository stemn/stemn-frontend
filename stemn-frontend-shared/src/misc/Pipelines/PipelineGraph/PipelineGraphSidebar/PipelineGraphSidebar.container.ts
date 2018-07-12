import { connect } from 'react-redux'
import { PipelineGraphSidebarComponent } from './PipelineGraphSidebar'
import { get } from 'lodash'

const stateToProps = ({ pipelineGraph }, { diagramId }) => {
  const diagram = pipelineGraph[diagramId] || {}
  return {
    diagram: pipelineGraph[diagramId] || {},
    selectedStep: get(diagram, ['model', 'steps', diagram.selectedStep])
  }
}

const dispatchToProps = {
}

export const PipelineGraphSidebar = connect(stateToProps, dispatchToProps)(PipelineGraphSidebarComponent)
