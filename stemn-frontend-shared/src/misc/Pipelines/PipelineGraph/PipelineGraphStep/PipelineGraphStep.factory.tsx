import * as React from 'react'
import { DiagramEngine, AbstractNodeFactory } from 'mrblenny-storm-react-diagrams'
import { PipelineGraphStep, PipelineGraphStepModel } from './';

export class PipelineGraphStepFactory extends AbstractNodeFactory {
	constructor(nodeType: string) {
		super(nodeType);
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: PipelineGraphStepModel) {
		return <PipelineGraphStep node={ node } />
	}

	getNewInstance() {
		return new PipelineGraphStepModel('trigger');
	}
}