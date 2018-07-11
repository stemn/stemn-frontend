import * as React from 'react'
import * as cn from 'classnames'
import * as s from './PipelineGraphSidebarWidget.scss'

export const PipelineGraphSidebarWidget = () => {
  return (
    <div
      className={ cn(s.sidebarWidget, 'layout-column', 'layout-align-center-center') }
      draggable
      onDragStart={ (event) => {
        event.dataTransfer.setData('storm-diagram-node', JSON.stringify({ type: 'test' }))
      } }
    >
      Woo
    </div>
  )
}