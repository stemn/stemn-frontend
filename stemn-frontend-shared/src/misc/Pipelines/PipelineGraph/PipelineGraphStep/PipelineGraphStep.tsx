import * as React from 'react'
import { PipelineGraphStepModel } from './'
import * as s from './PipelineGraphStep.scss'
import { PipelineGraphPorts } from '../PipelineGraphPorts'
import SimpleTable from 'stemn-shared/misc/Tables/SimpleTable/SimpleTable.jsx'
import { mapObjIndexed, values, pipe } from 'ramda'
import { lowerCase, capitalize, flow } from 'lodash/fp'
import PiplineIcon from '../../PipelineIcon'
import * as cn from 'classnames'

const prettyKey = flow(lowerCase, capitalize)

export interface PipelineGraphStepProps {
	node: PipelineGraphStepModel;
}

const mapTableRows = pipe(
	mapObjIndexed((val: string, key) => 
		<tr key={ key }>
			<div>{ prettyKey(key) }</div><div className="text-ellipsis">{ val }</div>
		</tr>),
	values
)

export class PipelineGraphStepComponent extends React.Component<PipelineGraphStepProps> {
	render() {
		const { node, isSelected } = this.props

		return (
			<div className={ cn(s.outer, {[s.selected]: isSelected}) }>
				<PipelineGraphPorts type="input" node={ node } isSelected={ isSelected } />
				<div className={ s.step }>
					<div className={ cn(s.title, 'layout-row layout-align-start-center') }>
						<div className="flex">{ node.type }</div>
						<PiplineIcon status="running" />
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
				<PipelineGraphPorts type="output" node={ node } isSelected={ isSelected } />
			</div>
		);
	}
}
