import * as cn from 'classnames'
import { DiagramEngine } from 'mrblenny-storm-react-diagrams'
import * as React from 'react'
import {
  addStep as addStepType,
  selectStep as selectStepType,
} from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraph.actions'

export interface IPipelineGraphDroplayerProps {
  diagramId: string,
  children: JSX.Element,
  addStep: typeof addStepType,
  selectStep: typeof selectStepType,
  diagramEngine: DiagramEngine,
}

export class PipelineGraphDroplayer extends React.PureComponent<IPipelineGraphDroplayerProps> {
  public render () {
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
              ports: {},
            },
          })

        } }
        onDragOver={ (event) => {
          event.preventDefault()
        } }
      >
        {/* <div
          onClick={ () => selectStep({ diagramId, stepId: undefined })}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            zIndex: 1,
          }}
        /> */}
        { children }
      </div>
    )
  }
}
