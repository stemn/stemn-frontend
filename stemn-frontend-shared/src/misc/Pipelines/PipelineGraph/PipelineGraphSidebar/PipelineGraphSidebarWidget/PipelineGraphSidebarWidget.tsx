import * as cn from 'classnames'
import * as React from 'react'
import { IStep } from 'stemn-shared/misc/Pipelines/PipelineGraph/types'
import * as s from './PipelineGraphSidebarWidget.scss'

export interface IPipelineGraphSidebarWidgetProps {
  step: IStep,
}

export const PipelineGraphSidebarWidget = (props: IPipelineGraphSidebarWidgetProps) => {
  const { step } = props
  return (
    <div className={cn(s.sidebarWidget, 'layout-column', 'layout-align-center-center')}>
      <div
        className={cn(s.icon, 'layout-column', 'layout-align-center-center')}
        draggable={true}
        onDragStart={ (event) => {
          event.dataTransfer.setData('storm-diagram-node', JSON.stringify({
            nodeType: step.type,
          }))
        } }
      >
        <step.icon />
      </div>
      <div>{step.name}</div>
    </div>
  )
}
