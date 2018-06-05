import React, { Component } from 'react'

import cn from 'classnames'
import classes from './PipelineMap.scss'
import PipelineIcon, { getStatusClass } from '../PipelineIcon'
import Link from 'stemn-shared/misc/Router/Link'
import PipelineMapCurve from './PipelineMapCurve'


export default class PipelineMap extends Component {
  render() {
    const { pipeline, stepData } = this.props
    const { _id: pipelineId, project: { _id: projectId } } = pipeline
    return (
      <div className={ cn('layout-row flex', classes.outer) }>
        { pipeline.stages.map((stage, idx) => (
          <div key={ stage._id } className={ classes.stage }>
            <div className="text-ellipsis">{stage.name}</div>
            <br />
            <div>
              { stage.steps.map((stepId, stepIdx) => {
                const step = stepData[stepId] && stepData[stepId].data
                  ? stepData[stepId].data
                  : {}
                  
                return (
                  <div key={ stepId } className={ classes.step }>
                    <Link
                      className={ cn('layout-row layout-align-start-center', getStatusClass(step.status)) }
                      name="projectPipelineStepRoute"
                      params={ {
                        projectId,
                        pipelineId,
                        stepId,
                      } }
                      title={ step.name }
                    >
                      <PipelineIcon status={ step.status } style={ { marginRight: '10px' } } /> 
                      <span className="flex text-ellipsis">{ step.name } #S{ step.stepNumber }</span>
                    </Link>
                    { idx !== pipeline.stages.length - 1 && <PipelineMapCurve side="right" connectTo={ stepIdx }  /> }
                    { idx !== 0 && <PipelineMapCurve side="left" connectTo={ stepIdx } /> }
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }
}
