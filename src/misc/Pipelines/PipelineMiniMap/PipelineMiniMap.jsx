import React, { Component } from 'react'

import cn from 'classnames'
import classes from './PipelineMiniMap.scss'
import PipelineIcon from '../PipelineIcon'
import Popover from 'stemn-shared/misc/Popover/Popover'
import PopoverMenuList from 'stemn-shared/misc/PopoverMenu/PopoverMenuList'

const stages = [{
  status: 'success',
  steps: [{
    status: 'success',
  }],
}, {
  status: 'running',
  steps: [{
    status: 'running',
  }],
}, {
  status: 'error',
  steps: [{
    status: 'error',
  }],
}, {
  status: 'pending',
  steps: [{
    status: 'pending',
  }, {
    status: 'pending',
  }],
}, {
  status: 'pending',
  steps: [{
    status: 'pending',
    name: 'name here',
  }, {
    status: 'pending',
    name: 'name here 2',
  }, {
    status: 'pending',
    name: 'name here 3',
  }, {
    status: 'pending',
    name: 'name here 4',
  }],
}]

const PopupRowItem = ({ status, name }) => (
  <span className="layout-row layout-align-start-center">
    <PipelineIcon status={ status } style={ { marginRight: '10px' } } /> 
    { name }
  </span>
)

export default class PipelineMiniMap extends Component {
  render() {
    return (
      <div className={ cn('layout-row', classes.outer) }>
        { stages.map((stage, idx) => {
          const menu = stage.steps.map((step, stepIdx) => ({ 
            key: stepIdx,
            label: <PopupRowItem status={ step.status } name={ step.name } />,
            onClick: () => {},
          }))
          
          return (
            <Popover
              key={ idx }
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
