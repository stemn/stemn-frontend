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
import { isEqual, forEach, values, get } from 'lodash'
import { IPipelineConfig } from 'stemn-shared/misc/Pipelines/PipelineGraph/types'

export interface PipelineGraphProps {
	diagramId: string,
	pipelineConfig: string,
	readOnly: boolean,
	className?: string,
	diagram: {
		selectedStep: string;
    model: IPipelineConfig;
	},
	style?: object,
	initialiseModel: typeof initialiseModelType,
	addStep: typeof addStepType,
	selectStep: typeof selectStepType,
}

export interface PipelineGraphState {
	diagramEngine: DiagramEngine,
	diagramModel?: DiagramModel,
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
		const nextModel = get(nextProps, 'diagram.model')
		const currentModel = get(this.props, 'diagram.model')
		// Update the diagram model if the pipeline changes
		if (!isEqual(nextModel, currentModel)) {
			const diagramModel = deserializePipeline(nextProps.diagramId, nextModel, diagramEngine)
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
		if (this.state.diagramModel) {
			const model = serializePipeline(this.state.diagramModel, 'test')
			this.props.initialiseModel({ diagramId: this.props.diagramId, model })
		}
	}
	render() {
		const { readOnly, className, style, addStep, selectStep, diagramId } = this.props
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
					selectStep={ selectStep }
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