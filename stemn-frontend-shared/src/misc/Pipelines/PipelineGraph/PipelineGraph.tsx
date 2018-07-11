import * as React from 'react'
import * as cn from 'classnames'
import { DiagramEngine,	DiagramModel, DiagramWidget } from 'mrblenny-storm-react-diagrams'
import { PipelineGraphStepModel } from './PipelineGraphStep'
import { PipelineGraphDroplayer } from './PipelineGraphDroplayer';
import { deserializePipeline, createDiagramEngine } from './utils'
import { safeLoad } from 'js-yaml'
import './PipelineGraph.global.scss'
import * as s from './PipelineGraph.scss'

export interface PipelineGraphProps {
	pipelineConfig: string,
	readOnly: boolean,
}

export interface PipelineGraphState {
	diagramEngine: DiagramEngine,
	diagramModel: DiagramModel,
	selected?: PipelineGraphStepModel,
}

export class PipelineGraph extends React.Component<PipelineGraphProps, PipelineGraphState> {
	constructor(props: PipelineGraphProps) {
		super(props)
		const { pipelineConfig } = this.props
	
		const diagramEngine = createDiagramEngine()
		const pipelineConfigJson = safeLoad(pipelineConfig)

		const diagramModel = deserializePipeline(pipelineConfigJson, diagramEngine)
		diagramEngine.setDiagramModel(diagramModel)

    this.state = {
      diagramEngine,
      diagramModel,
    }
	}
	addNode = (node: PipelineGraphStepModel) => {
		this.state.diagramModel.addNode(node)
    this.selectNode(node)
	}
	selectNode = (node: PipelineGraphStepModel) => this.setState({ selected: node })
	render() {
		const { readOnly } = this.props
		const { diagramEngine, diagramModel } = this.state

		diagramModel.setLocked(readOnly);
		
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
            smartRouting
            deleteKeys={ [46] } // Delete
					/>
				</PipelineGraphDroplayer>
			</div>
		)
	};
}