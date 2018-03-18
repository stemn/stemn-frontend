import React, { Component } from 'react'

import cn from 'classnames'
import classes from './PipelineMap.scss'
import PipelineIcon from '../PipelineIcon'
import Link from 'stemn-shared/misc/Router/Link'
import PipelineMapCurve from './PipelineMapCurve'

const stages = [{
  name: 'Build CAD Files',
  status: 'success',
  steps: [{
    name: 'Build CAD files',
    status: 'success',
  }, {
    name: 'Build other CAD files',
    status: 'success',
  }],
}, {
  name: 'Build STL Files',
  status: 'running',
  steps: [{
    name: 'Build STLs',
    status: 'running',
  }],
}, {
  name: 'Produce Renders',
  status: 'error',
  steps: [{
    name: 'Render',
    status: 'error',
  }, {
    name: 'Render',
    status: 'pending',
  }],
}, {
  name: 'Email renders',
  status: 'pending',
  steps: [{
    name: 'Send email',
    status: 'pending',
  }, {
    name: 'Send slack notification',
    status: 'pending',
  }, {
    name: 'Send slack notification',
    status: 'pending',
  }, {
    name: 'Send slack notification',
    status: 'pending',
  }],
}]

export default class PipelineMap extends Component {
  render() {
    return (
      <div className={ cn('layout-row', classes.outer) }>
        { stages.map((stage, idx) => (
          <div key={ idx } className={ classes.stage }>
            <div>{stage.name}</div>
            <br />
            <div>
              { stage.steps.map((step, stepIdx) => (
                <Link className={ cn('layout-row layout-align-start-center', classes.step) }>
                  { idx !== 0 && <PipelineMapCurve side="left" connectTo={ stepIdx } /> }
                  <PipelineIcon status={ step.status } style={ { marginRight: '10px' } } /> 
                  { step.name }
                  { idx !== stages.length - 1 && <PipelineMapCurve side="right" connectTo={ stepIdx }  /> }
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
}
