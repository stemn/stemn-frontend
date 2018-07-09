import { DiagramModel, DiagramEngine } from 'mrblenny-storm-react-diagrams'
import { IPipelineConfig } from '../types'

export const pipelineToModel = (pipeline: IPipelineConfig, diagramEngine: DiagramEngine) => {
  const model = new DiagramModel()
  model.deSerializeDiagram(pipeline, diagramEngine)
  return model
}