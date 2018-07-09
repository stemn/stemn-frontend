import { DiagramEngine,	DiagramModel, DiagramWidget } from 'mrblenny-storm-react-diagrams'
import * as React from 'react'
// import { PipelineGraphPortModel } from './PipelineGraphPort'
import { PipelineGraphStepFactory } from './PipelineGraphStep'
import * as cn from 'classnames'

export interface PipelineGraphProps {
}

export class PipelineGraph extends React.Component<PipelineGraphProps> {
	render() {
		const engine = new DiagramEngine();
		engine.installDefaultFactories();
		engine.registerNodeFactory(new PipelineGraphStepFactory('trigger'))
		const model = new DiagramModel();
		engine.setDiagramModel(model);
	
		// return 'test'
		return <DiagramWidget className="flex" diagramEngine={engine} />
	};
}