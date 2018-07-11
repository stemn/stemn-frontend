import { PipelineGraphPortModel, PipelineGraphPortFactory } from '../PipelineGraphPort';
import { PipelineGraphStepFactory } from '../PipelineGraphStep';
import { DiagramEngine } from 'mrblenny-storm-react-diagrams'

export const createDiagramEngine = () => {
  const diagramEngine = new DiagramEngine()

  diagramEngine.installDefaultFactories()
  diagramEngine.registerPortFactory(new PipelineGraphPortFactory('input', () => new PipelineGraphPortModel('input')))
  diagramEngine.registerPortFactory(new PipelineGraphPortFactory('output', () => new PipelineGraphPortModel('output')))
  diagramEngine.registerNodeFactory(new PipelineGraphStepFactory('some_type'))
  diagramEngine.registerNodeFactory(new PipelineGraphStepFactory('some_other_type'))
  
  return diagramEngine
}