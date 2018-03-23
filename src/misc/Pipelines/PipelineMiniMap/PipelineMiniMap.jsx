import React, { Component } from 'react'

import cn from 'classnames'
import classes from './PipelineMiniMap.scss'
import PipelineIcon from '../PipelineIcon'
import Popover from 'stemn-shared/misc/Popover/Popover'
import PopoverMenuList from 'stemn-shared/misc/PopoverMenu/PopoverMenuList'

const PopupRowItem = ({ status, name }) => (
  <span className="layout-row layout-align-start-center">
    <PipelineIcon status={ status } style={ { marginRight: '10px' } } /> 
    { name }
  </span>
)

export default class PipelineMiniMap extends Component {
  render() {
    const { pipeline } = this.props
    const { _id: pipelineId, stages, project: { _id: projectId } } = pipeline
    return (
      <div className={ cn('layout-row', classes.outer) }>
        { stages.map((stage) => {
          const menu = stage.steps.map(step => ({ 
            key: step._id,
            label: <PopupRowItem status={ step.status } name={ step.name } />,
            name: 'projectPipelineStepRoute',
            params: {
              projectId,
              pipelineId,
              stepId: step._id,
            },
          }))
          
          return (
            <Popover
              key={ stage._id }
              trigger="hoverDelay"
              preferPlace="below"
            >
              <PipelineIcon status={ stage.status } />
              <PopoverMenuList menu={ menu }  />
            </Popover>
          )
        })}
      </div>
    )
  }
}
