import * as cn from 'classnames'
import { capitalize, flow, lowerCase } from 'lodash/fp'
import { mapObjIndexed, pipe, values } from 'ramda'
import * as React from 'react'
import { selectStep as selectStepType } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraph.actions'
// import PiplineIcon from '../../PipelineIcon'
import { PipelineGraphPorts } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphPorts'
import { PipelineGraphStepModel } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphStep'
import { IStep } from 'stemn-shared/misc/Pipelines/PipelineGraph/types'
import SimpleTable from 'stemn-shared/misc/Tables/SimpleTable/SimpleTable.jsx'
import * as s from './PipelineGraphStep.scss'

const prettyKey = flow(lowerCase, capitalize)

export interface IPipelineGraphStepProps {
  node: PipelineGraphStepModel,
  stepInfo: IStep | undefined,
  isSelected: boolean,
  selectStep: typeof selectStepType,
}

const mapTableRows = pipe(
  mapObjIndexed((val: string, key) =>
    <div key={ key }>
      <div>{ prettyKey(key) }</div><div className='text-ellipsis'>{ val }</div>
    </div>),
  values,
)

export const PipelineGraphStepComponent = (props: IPipelineGraphStepProps) => {
  const { node, isSelected, selectStep, stepInfo } = props
  const diagramId = node.parent.id

  return (
    <div
      className={ cn(s.outer, { [s.selected]: isSelected }) }
      onClick={ () => selectStep({ diagramId, stepId: node.id }) }
    >
      <PipelineGraphPorts type='input' node={ node } isSelected={ isSelected } />
      <div className={ s.step }>
        <div className={ cn(s.title, 'layout-row layout-align-start-center') }>
          { stepInfo && <stepInfo.icon className={ s.icon } /> }
          <div className='flex'>{ node.type }</div>
          {/* <PiplineIcon status='running' /> */}
        </div>
        <div className={ s.body }>
          { node.extras && node.extras.config && (
            <SimpleTable flex>{ mapTableRows(node.extras.config) }</SimpleTable>
          )}
          { node.extras && node.extras.command &&
            Array.isArray(node.extras.command)
            ? node.extras.command.map((item: string, key: string) => <div key={ key }>{ item }</div>)
            : node.extras.command
          }
        </div>
      </div>
      <PipelineGraphPorts type='output' node={ node } isSelected={ isSelected } />
    </div>
  )
}
