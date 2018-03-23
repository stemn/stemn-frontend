import React, { Component } from 'react'

import cn from 'classnames'
import classes from './PipelineMap.scss'
import PipelineIcon from '../PipelineIcon'
import Link from 'stemn-shared/misc/Router/Link'
import PipelineMapCurve from './PipelineMapCurve'

export default class PipelineMap extends Component {
  render() {
    const { pipeline } = this.props
    const { _id: pipelineId, project: { _id: projectId } } = pipeline
    return (
      <div className={ cn('layout-row', classes.outer) }>
        { pipeline.stages.map((stage, idx) => (
          <div key={ stage._id } className={ classes.stage }>
            <div className="text-ellipsis">{stage.name}</div>
            <br />
            <div>
              { stage.steps.map((step, stepIdx) => (
                <div key={ step._id } className={ classes.step }>
                  <Link
                    className={ cn('layout-row layout-align-start-center') }
                    name="projectPipelineStepRoute"
                    params={ {
                      projectId,
                      pipelineId,
                      stepId: step._id,
                    } }
                    title={ step.name }
                  >
                    <PipelineIcon status={ step.status } style={ { marginRight: '10px' } } /> 
                    <span className="flex text-ellipsis">{ step.name }</span>
                  </Link>
                  { idx !== pipeline.stages.length - 1 && <PipelineMapCurve side="right" connectTo={ stepIdx }  /> }
                  { idx !== 0 && <PipelineMapCurve side="left" connectTo={ stepIdx } /> }
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
}
