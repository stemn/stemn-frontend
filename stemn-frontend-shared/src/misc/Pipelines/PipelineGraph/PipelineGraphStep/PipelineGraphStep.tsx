import * as React from 'react'
import { PipelineGraphStepModel } from './'
import * as s from './PipelineGraphStep.scss'
import { PipelineGraphPorts } from '../PipelineGraphPorts'

export interface PipelineGraphStepProps {
	node: PipelineGraphStepModel;
}

export class PipelineGraphStep extends React.Component<PipelineGraphStepProps> {
	render() {
		const { node } = this.props
		// const inputPorts = filter()
		return (
			<div>
				<PipelineGraphPorts type="input" node={ node } />
				<div className={ s.step }>
					{ node.type }
				</div>
				<PipelineGraphPorts type="output" node={ node } />
			</div>
		);
	}
}
