import * as React from 'react'
import * as cn from 'classnames'
import { DiagramEngine } from 'mrblenny-storm-react-diagrams'
import { addStep as addStepType } from '../PipelineGraph.actions'

export interface IPipelineGraphDroplayerProps {
  diagramId: string,
  children: JSX.Element,
  addStep: typeof addStepType,
  diagramEngine: DiagramEngine,
}

export class PipelineGraphDroplayer extends React.PureComponent<IPipelineGraphDroplayerProps> {
  render() {
    const { addStep, diagramEngine, children, diagramId } = this.props
    return (
      <div
        className={ cn('flex', 'layout-column') }
        onDrop={ (event) => {
          const data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'))
          const points = diagramEngine.getRelativeMousePoint(event)

          addStep({
            diagramId,
            stepId: 'some_thingo',
            step: {
              type: data.nodeType,
              position: {
                x: points.x,
                y: points.y,
              },
              ports: {}
            }
          })
          
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
