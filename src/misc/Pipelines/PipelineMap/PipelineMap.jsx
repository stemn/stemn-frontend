import React, { Component } from 'react'

import cn from 'classnames'
import classes from './PipelineMap.scss'
import PipelineIcon from '../PipelineIcon'
import Link from 'stemn-shared/misc/Router/Link'
import PipelineMapCurve from './PipelineMapCurve'
import { pipeline } from '../Pipeline.data'

export default class PipelineMap extends Component {
  render() {
    const { _id: pipelineId, project: { _id: projectId } } = pipeline
    return (
      <div className={ cn('layout-row', classes.outer) }>
        { pipeline.stages.map((stage, idx) => (
          <div key={ stage._id } className={ classes.stage }>
            <div>{stage.name}</div>
            <br />
            <div>
              { stage.steps.map((step, stepIdx) => (
                <Link
                  key={ step._id }
                  className={ cn('layout-row layout-align-start-center', classes.step) }
                  name="projectPipelineStepRoute"
                  params={ {
                    projectId,
                    pipelineId,
                    stepId: step._id,
                  } }
                >
                  { idx !== 0 && <PipelineMapCurve side="left" connectTo={ stepIdx } /> }
                  <PipelineIcon status={ step.status } style={ { marginRight: '10px' } } /> 
                  { step.name }
                  { idx !== pipeline.stages.length - 1 && <PipelineMapCurve side="right" connectTo={ stepIdx }  /> }
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
}
