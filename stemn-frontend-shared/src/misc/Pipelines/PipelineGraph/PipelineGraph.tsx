import * as React from 'react'
import * as cn from 'classnames'
import { DiagramEngine,	DiagramModel, DiagramWidget, BaseAction } from 'mrblenny-storm-react-diagrams'
import { PipelineGraphStepModel } from './PipelineGraphStep'
import { PipelineGraphDroplayer } from './PipelineGraphDroplayer';
import { deserializePipeline, serializePipeline, createDiagramEngine } from './utils'
import { safeLoad } from 'js-yaml'
import './PipelineGraph.global.scss'
import * as s from './PipelineGraph.scss'
import { 
	initialiseModel as initialiseModelType,
	addStep as addStepType,
	selectStep as selectStepType,
} from './PipelineGraph.actions'
import { isEqual, forEach, values } from 'lodash'

export interface PipelineGraphProps {
	diagramId: string,
	pipelineConfig: string,
	readOnly: boolean,
	className?: string,
	initialiseModel: typeof initialiseModelType,
	addStep: typeof addStepType,
	selectStep: typeof selectStep,
	style?: object,
}

export interface PipelineGraphState {
	diagramEngine: DiagramEngine,
	diagramModel: DiagramModel,
	selected?: PipelineGraphStepModel,
}

export class PipelineGraphComponent extends React.Component<PipelineGraphProps, PipelineGraphState> {
	constructor(props: PipelineGraphProps) {
		super(props)
		const { pipelineConfig, initialiseModel, diagramId } = this.props
	
		const diagramEngine = createDiagramEngine()
		const pipelineConfigJson = typeof pipelineConfig === 'object' 
			? pipelineConfig 
			: safeLoad(pipelineConfig)

		initialiseModel({ diagramId, model: pipelineConfigJson })

    this.state = {
      diagramEngine,
    }
	}
	componentWillReceiveProps(nextProps: PipelineGraphProps) {
		const { diagramEngine } = this.state

		// Update the diagram model if the pipeline changes
		if (!isEqual(nextProps.diagram.model, this.props.diagram.model)) {
			const diagramModel = deserializePipeline(nextProps.diagramId, nextProps.diagram.model, diagramEngine)
			diagramEngine.setDiagramModel(diagramModel)
			this.setState({ diagramModel })
		}

	}
  addListeners = (model) => {
    forEach(model.nodes, (item) => {
      // Add selection listener
      const hasSelectionListener = values(item.listeners).some(listener => listener.selectionChanged)
      if (!hasSelectionListener) {
        item.addListener({ selectionChanged: this.onSelectionChange })
      }

      // Add remove listener
      const hasRemoveListener = values(item.listeners).some(listener => listener.entityRemoved === this.onEntityRemoved)
      if (!hasRemoveListener) {
        item.addListener({ entityRemoved: this.onEntityRemoved })
      }
    })
  }
  onSelectionChange = (node) => {
    if (node.isSelected) {
      this.props.selectStep({ diagramId: this.props.diagramId, stepId: node.entity.id })
    } else {
      this.props.selectStep({ diagramId: this.props.diagramId, stepId: undefined })
    }
  }
	onEntityRemoved = () => this.props.selectStep({ diagramId: this.props.diagramId, stepId: undefined })
	updateReduxState = (action: BaseAction) => {
		const model = serializePipeline(this.props.diagramModel, 'test')
		this.props.initialiseModel({ diagramId, model })
	}
	render() {
		const { readOnly, pipelineConfig, className, style, addStep, diagramId, diagram } = this.props
		const { diagramEngine, diagramModel } = this.state
		
		if (!diagramModel) {
			return null
		}
		
		this.addListeners(diagramModel)
		diagramModel.setLocked(readOnly);
		
		return (
			<div className={ cn('layout-column flex', className) } style={ style }>
			  <PipelineGraphDroplayer
					diagramId={ diagramId }
					addStep={ addStep }
					diagramEngine={ diagramEngine } 
				>
					<DiagramWidget 
						className={ cn('flex', s.diagram, { [s.edit]: !readOnly } )} 
						diagramEngine={ diagramEngine } 
						allowLooseLinks={ false }
            maxNumberPointsPerLink={ 0 }
            smartRouting
						deleteKeys={ [46] } // Delete
						actionStoppedFiring={ this.updateReduxState }
					/>
				</PipelineGraphDroplayer>
			</div>
		)
	};
}