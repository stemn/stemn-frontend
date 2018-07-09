import * as React from 'react'
import { PipelineGraphStepModel } from './'

export interface PipelineGraphStepProps {
	node: PipelineGraphStepModel;
}

export class PipelineGraphStep extends React.Component<PipelineGraphStepProps> {
	render() {
		return (
			<div>
        Here we are
			</div>
		);
	}
}