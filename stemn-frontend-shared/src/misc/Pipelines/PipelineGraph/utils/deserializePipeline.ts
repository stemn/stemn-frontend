import { DiagramModel, DiagramEngine } from 'mrblenny-storm-react-diagrams'
import { IPipelineConfig } from '../types'
import { mapObjIndexed, values } from 'ramda'
import { get } from 'lodash'
import * as uuid from 'uuid/v4'

type ISerializedDiagram = ReturnType<DiagramModel['serializeDiagram']>
type IPipelineConfigWithIds = ReturnType<typeof addIdsToPipeline>

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
 * Create an empty point. The diagram engine will add a real x-y coord
 */
const emptyPoint = () => ({
  type: 'default',
  selected: false,
  id: uuid(),
  y: 0,
  x: 0
})


/**
 * Deserialize the links
 */
const deserializeLinks = (pipeline: IPipelineConfigWithIds): ISerializedDiagram['links'] => pipeline.links.map(link => {
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
 * Deserializes a port
 * Links are auto calculated
 */
const deserializePort = (type: string, stepId: string) => (port: { id: string, value: string }) => ({
  id: port.id,
  name: port.id,
  type: type,
  parentNode: stepId,
  selected: false,
  links: [],
  maximumLinks: 1,
})

/**
 * Deserializes the nodes
 * Converts the steps to nodes and deserializes the ports
 */
const deserializeNodes = (pipeline: IPipelineConfigWithIds) => {
  const nodesObject = mapObjIndexed((step, stepId: string) => ({
    id: stepId,
    x: get(step, 'position.x', 50),
    y: get(step, 'position.y', 50),
    type: step.type,
    extras: {},
    selected: false,
    ports: [
      ...step.ports.in.map(deserializePort('input', stepId)), 
      ...step.ports.out.map(deserializePort('output', stepId))
    ],
  }), pipeline.steps)

  const nodes: ISerializedDiagram['nodes'] = values(nodesObject)
  return nodes
}

/**
 * Converts the pipeline config to a storm-react-diagrams diagram model
 * We do not use the model deserialize because we need both links and node data to deserialize either
 */
export const deserializePipeline = (pipeline: IPipelineConfig, diagramEngine: DiagramEngine) => {

  // Add ids to the ports and links
  const pipelineWithIds = addIdsToPipeline(pipeline)
  
  // Get the serialized diagram
  const diagram: ISerializedDiagram = {
    id: 'diagram',
    offsetX: 0,
    offsetY: 0,
    zoom: 100,
    gridSize: 0,
    links: deserializeLinks(pipelineWithIds),
    nodes: deserializeNodes(pipelineWithIds),
  }
  
  // Convert it to the model
  const model = new DiagramModel()
  model.deSerializeDiagram(diagram, diagramEngine)

  return model
}
