import { DiagramModel, DiagramEngine } from 'mrblenny-storm-react-diagrams'
import { IPipelineConfig, IPipelineConfigStepPort } from '../types'
import { mapObjIndexed, values } from 'ramda'
import { get } from 'lodash'
import * as uuid from 'uuid/v4'

type ISerializedDiagram = ReturnType<DiagramModel['serializeDiagram']>
type IPipelineConfigWithIds = ReturnType<typeof addIdsToPipeline>

/**
 * This will add uuids to the links.
 * This is requried so we can convert to the storm-react-diagrams type
 */
const addIdsToPipeline = (pipeline: IPipelineConfig) => ({
  ...pipeline,
  links: pipeline.links.map((link) => ({ id: uuid(), ...link })),
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
  const fromSplit = link.from.split('.')
  const toSplit = link.to.split('.')

  return {
    id: link.id,
    type: 'default',
    selected: false,
    source: fromSplit[0],
    sourcePort: fromSplit[fromSplit.length - 1],
    target: toSplit[0],
    targetPort: toSplit[toSplit.length - 1],
    points: [emptyPoint(), emptyPoint()],
    labels: [],
    extras: {},
    width: 3
  }
})

/**
 * Deserializes a port
 * Links are auto calculated
 */
const deserializePort = (stepId: string) => (port: IPipelineConfigStepPort, portId: string) => {
  return {
    id: portId,
    name: portId,
    type: port.type,
    value: port.value,
    parentNode: stepId,
    selected: false,
    links: [],
    maximumLinks: 1,
  }
}

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
    ports: values(mapObjIndexed(deserializePort(stepId), step.ports)),
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
