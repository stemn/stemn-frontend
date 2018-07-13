import * as cn from 'classnames'
import { capitalize, flow, lowerCase } from 'lodash/fp'
import { mapObjIndexed, pipe, values } from 'ramda'
import * as React from 'react'
import SimpleTable from 'stemn-shared/misc/Tables/SimpleTable/SimpleTable.jsx'
import PiplineIcon from '../../PipelineIcon'
import { PipelineGraphPorts } from '../PipelineGraphPorts'
import { PipelineGraphStepModel } from './'
import * as s from './PipelineGraphStep.scss'

const prettyKey = flow(lowerCase, capitalize)

export interface IPipelineGraphStepProps {
	node: PipelineGraphStepModel,
	isSelected: boolean,
}

const mapTableRows = pipe(
  mapObjIndexed((val: string, key) =>
    <tr key={ key }>
      <div>{ prettyKey(key) }</div><div className='text-ellipsis'>{ val }</div>
    </tr>),
  values,
)

export class PipelineGraphStepComponent extends React.Component<IPipelineGraphStepProps> {
  public render () {
    const { node, isSelected } = this.props

    return (
      <div className={ cn(s.outer, { [s.selected]: isSelected }) }>
        <PipelineGraphPorts type='input' node={ node } isSelected={ isSelected } />
        <div className={ s.step }>
          <div className={ cn(s.title, 'layout-row layout-align-start-center') }>
            <div className='flex'>{ node.type }</div>
            <PiplineIcon status='running' />
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
}
