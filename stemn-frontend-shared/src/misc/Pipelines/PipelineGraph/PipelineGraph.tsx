import * as React from 'react'
import * as cn from 'classnames'
import { DiagramEngine,	DiagramModel, DiagramWidget } from 'mrblenny-storm-react-diagrams'
import { PipelineGraphStepFactory, PipelineGraphStepModel } from './PipelineGraphStep'
import { PipelineGraphDroplayer } from './PipelineGraphDroplayer';
import { pipelineToModel } from './utils'
import { IPipelineConfig } from './types'
import * as s from './PipelineGraph.scss'
// import { PipelineGraphPortModel } from './PipelineGraphPort'

export interface PipelineGraphProps {
	pipeline: IPipelineConfig
}

export interface PipelineGraphState {
	diagramEngine: DiagramEngine,
	model: DiagramModel,
	selected?: PipelineGraphStepModel,
}

export class PipelineGraph extends React.Component<PipelineGraphProps, PipelineGraphState> {
	constructor(props: PipelineGraphProps) {
		super(props)
		const { pipeline } = this.props
	
		const diagramEngine = new DiagramEngine()
    diagramEngine.installDefaultFactories()
		diagramEngine.registerNodeFactory(new PipelineGraphStepFactory('trigger'))

		const model = pipelineToModel(pipeline, diagramEngine)
		diagramEngine.setDiagramModel(model)

    this.state = {
      diagramEngine,
      model,
    }
	}
	addNode = (node: PipelineGraphStepModel) => {
		this.state.model.addNode(node)
    this.selectNode(node)
	}
	selectNode = (node: PipelineGraphStepModel) => this.setState({ selected: node })
	render() {
		const { diagramEngine } = this.state
		return (
			<div className="layout-column flex">
			  <PipelineGraphDroplayer
					addNode={ this.addNode }
					diagramEngine={ diagramEngine } 
				>
					<DiagramWidget 
						className={ cn('flex', s.diagram )} 
						diagramEngine={ diagramEngine } 
						allowLooseLinks={ false }
            maxNumberPointsPerLink={ 0 }
            // smartRouting
            deleteKeys={ [46] } // Delete
					/>
				</PipelineGraphDroplayer>
			</div>
		)
	};
}