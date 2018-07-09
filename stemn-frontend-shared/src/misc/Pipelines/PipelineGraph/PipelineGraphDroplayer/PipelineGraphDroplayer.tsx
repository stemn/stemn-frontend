import * as React from 'react'
import * as cn from 'classnames'
import { DiagramEngine } from 'mrblenny-storm-react-diagrams'
import { PipelineGraphStepModel } from '../PipelineGraphStep'

export interface IPipelineGraphDroplayerProps {
  children: JSX.Element,
  addNode: (node: PipelineGraphStepModel) => any,
  diagramEngine: DiagramEngine,
}

export class PipelineGraphDroplayer extends React.PureComponent<IPipelineGraphDroplayerProps> {
  render() {
    const { addNode, diagramEngine, children } = this.props
    return (
      <div
        className={ cn('flex', 'layout-column') }
        onDrop={ (event) => {
          const data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'))
          const node = new PipelineGraphStepModel(data.nodeType)
          const points = diagramEngine.getRelativeMousePoint(event)
          node.x = points.x
          node.y = points.y
          addNode(node)
        } }
        onDragOver={ (event) => {
          event.preventDefault()
        } }
      >
        { children }
      </div>
    )
  }  
}
