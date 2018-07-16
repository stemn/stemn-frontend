import { DiagramEngine } from 'mrblenny-storm-react-diagrams'
import { PipelineGraphPortFactory, PipelineGraphPortModel } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphPort'
import { PipelineGraphStepFactory } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphStep'

export const createDiagramEngine = () => {
  const diagramEngine = new DiagramEngine()

  diagramEngine.installDefaultFactories()
  diagramEngine.registerPortFactory(new PipelineGraphPortFactory('input', () => new PipelineGraphPortModel('input')))
  diagramEngine.registerPortFactory(new PipelineGraphPortFactory('output', () => new PipelineGraphPortModel('output')))
  diagramEngine.registerNodeFactory(new PipelineGraphStepFactory('some_type'))
  diagramEngine.registerNodeFactory(new PipelineGraphStepFactory('some_other_type'))

  return diagramEngine
}
