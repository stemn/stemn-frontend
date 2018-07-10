import { DiagramModel, DiagramEngine } from 'mrblenny-storm-react-diagrams'
import { IPipelineConfig } from '../types'
import { mapObjIndexed, values } from 'ramda'
import { get } from 'lodash'
import * as uuid from 'uuid/v4'

type ISerializedDiagram = ReturnType<DiagramModel['serializeDiagram']>
type IPipelineConfigWithIds = ReturnType<typeof addIdsToPipeline>

const emptyPoint = () => ({
  type: 'default',
  selected: false,
  id: uuid(),
  y: 0,
  x: 0
})

const pipelineToDiagramLinks = (pipeline: IPipelineConfigWithIds): ISerializedDiagram['links'] => pipeline.links.map(link => {
  const sourcePort = get(pipeline.steps, link.from, {}) as { id: string }
  const targetPort = get(pipeline.steps, link.to, {}) as { id: string }
  return {
    id: link.id,
    type: 'default',
    selected: false,
    source: link.from.split('.')[0],
    sourcePort: sourcePort.id,
    target: link.to.split('.')[0],
    targetPort: targetPort.id,
    points: [emptyPoint(), emptyPoint()],
    labels: [],
    extras: {},
  }
})

/**
 * Converts the nodes to diagram node format
 */
const pipelineToDiagramNodes = (pipeline: IPipelineConfigWithIds) => {
  const nodesObject = mapObjIndexed((step, stepId: string) => ({
    id: stepId,
    x: get(step, 'position.x', 50),
    y: get(step, 'position.y', 50),
    type: step.type,
    extras: {},
    selected: false,
    ports: [...step.ports.in, ...step.ports.out]
      .map(port => ({
        id: port.id,
        name: port.id,
        type: 'input',
        parentNode: stepId,
        selected: false,
        links: [],
        maximumLinks: 1,
      })),
  }), pipeline.steps)

  const nodes: ISerializedDiagram['nodes'] = values(nodesObject)
  return nodes
}

/**
 * This will add uuids to the links and ports.
 * This is requried so we can convert to the storm-react-diagrams type
 */
const addIdsToPipeline = (pipeline: IPipelineConfig) => ({
  ...pipeline,
  links: pipeline.links.map((link) => ({ id: uuid(), ...link })),
  steps: mapObjIndexed(step => ({
    ...step,
    ports: {
      in: step.ports.in.map(value => ({ id: uuid(), value })),
      out: step.ports.out.map(value => ({ id: uuid(), value })),
    },
  }), pipeline.steps)
})

/**
 * Converts the pipeline config to a storm-react-diagrams diagram model
 */
export const deserializePipeline = (pipeline: IPipelineConfig, diagramEngine: DiagramEngine) => {

  // Add ids to the ports and links
  const pipelineWithIds = addIdsToPipeline(pipeline)
  
  // Get the serialised diagram
  const diagramSerialised: ISerializedDiagram = {
    id: 'diagram',
    offsetX: 0,
    offsetY: 0,
    zoom: 100,
    gridSize: 0,
    links: pipelineToDiagramLinks(pipelineWithIds),
    nodes: pipelineToDiagramNodes(pipelineWithIds),
  }

  console.log(diagramSerialised)
  
  // Convert it to the model
  const model = new DiagramModel()
  model.deSerializeDiagram(diagramSerialised, diagramEngine)

  return model
}
