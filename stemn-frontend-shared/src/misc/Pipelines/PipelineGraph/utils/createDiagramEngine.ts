import { DiagramEngine } from 'mrblenny-storm-react-diagrams'
import { PipelineGraphPortFactory, PipelineGraphPortModel } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphPort'
import { PipelineGraphStepFactory } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphStep'
import { IStep } from 'stemn-shared/misc/Pipelines/PipelineGraph/types'

export const createDiagramEngine = (steps: IStep[]) => {
  const diagramEngine = new DiagramEngine()

  diagramEngine.installDefaultFactories()
  diagramEngine.registerPortFactory(new PipelineGraphPortFactory('input', () => new PipelineGraphPortModel('input')))
  diagramEngine.registerPortFactory(new PipelineGraphPortFactory('output', () => new PipelineGraphPortModel('output')))
  steps.forEach((step) => diagramEngine.registerNodeFactory(new PipelineGraphStepFactory(step.type)))

  return diagramEngine
}
