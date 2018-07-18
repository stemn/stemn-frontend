import * as cn from 'classnames'
import { safeLoad } from 'js-yaml'
import { forEach, get, isEqual, values } from 'lodash'
import { BaseAction,	DiagramEngine, DiagramModel, DiagramWidget } from 'mrblenny-storm-react-diagrams'
import * as React from 'react'
import {
  addStep as addStepType,
  initialiseModel as initialiseModelType,
  selectStep as selectStepType,
} from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraph.actions'
import { PipelineGraphDroplayer } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphDroplayer'
import { PipelineGraphStepModel } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphStep'
import { IPipelineConfig, IStep } from 'stemn-shared/misc/Pipelines/PipelineGraph/types'
import { createDiagramEngine, deserializePipeline, serializePipeline } from 'stemn-shared/misc/Pipelines/PipelineGraph/utils'
import './PipelineGraph.global.scss'
import * as s from './PipelineGraph.scss'

export interface IPipelineGraphProps {
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
  steps: IStep[],
}

export interface IPipelineGraphState {
  diagramEngine: DiagramEngine,
  diagramModel?: DiagramModel,
  selected?: PipelineGraphStepModel,
}

export class PipelineGraphComponent extends React.Component<IPipelineGraphProps, IPipelineGraphState> {
  constructor (props: IPipelineGraphProps) {
    super(props)
    const { pipelineConfig, initialiseModel, diagramId, steps } = this.props

    const diagramEngine = createDiagramEngine(steps)
    const pipelineConfigJson = typeof pipelineConfig === 'object'
      ? pipelineConfig
      : safeLoad(pipelineConfig)

    initialiseModel({ diagramId, model: pipelineConfigJson })

    this.state = {
      diagramEngine,
    }
  }
  public componentWillReceiveProps (nextProps: IPipelineGraphProps) {
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
  public addListeners = (model) => {
    forEach(model.nodes, (item) => {
      // Add selection listener
      const hasSelectionListener = values(item.listeners).some((listener) => listener.selectionChanged)
      if (!hasSelectionListener) {
        item.addListener({ selectionChanged: this.onSelectionChange })
      }

      // Add remove listener
      const hasRemoveListener = values(item.listeners).some((listener) => listener.entityRemoved === this.onEntityRemoved)
      if (!hasRemoveListener) {
        item.addListener({ entityRemoved: this.onEntityRemoved })
      }
    })
  }
  public onSelectionChange = (node) => {
    if (node.isSelected) {
      this.props.selectStep({ diagramId: this.props.diagramId, stepId: node.entity.id })
    } else {
      this.props.selectStep({ diagramId: this.props.diagramId, stepId: undefined })
    }
  }
  public onEntityRemoved = () => this.props.selectStep({ diagramId: this.props.diagramId, stepId: undefined })
  public updateReduxState = (action: BaseAction) => {
    if (this.state.diagramModel) {
      const model = serializePipeline(this.state.diagramModel, 'test')
      this.props.initialiseModel({ diagramId: this.props.diagramId, model })
    }
  }
  public render () {
    const { readOnly, className, style, addStep, selectStep, diagramId } = this.props
    const { diagramEngine, diagramModel } = this.state

    if (!diagramModel) {
      return null
    }

    this.addListeners(diagramModel)
    diagramModel.setLocked(readOnly)

    return (
      <div className={ cn('layout-column flex', className) } style={ style }>
        <PipelineGraphDroplayer
          diagramId={ diagramId }
          addStep={ addStep }
          selectStep={ selectStep }
          diagramEngine={ diagramEngine }
        >
          <DiagramWidget
            className={ cn('flex', s.diagram, { [s.edit]: !readOnly })}
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
  }
}
