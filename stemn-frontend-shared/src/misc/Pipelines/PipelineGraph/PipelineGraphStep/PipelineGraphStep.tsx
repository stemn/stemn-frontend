import * as React from 'react'
import { PipelineGraphStepModel } from './'
import * as s from './PipelineGraphStep.scss'

export interface PipelineGraphStepProps {
	node: PipelineGraphStepModel;
}

export class PipelineGraphStep extends React.Component<PipelineGraphStepProps> {
	render() {
		return (
			<div className={ s.step }>
        Here we are
			</div>
		);
	}
}