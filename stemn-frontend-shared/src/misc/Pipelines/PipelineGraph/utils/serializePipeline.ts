import { DiagramModel } from 'mrblenny-storm-react-diagrams'
import { IPipelineConfig } from '../types'
import { indexBy, mapObjIndexed } from 'ramda'

type ISerializedDiagram = ReturnType<DiagramModel['serializeDiagram']>

const serializePorts = (ports: any[]) => {
  const portsIndexed = indexBy(item => item.id, ports)
  return mapObjIndexed((port) => ({
    type: port.type,
    value: port.value,
  }), portsIndexed)
}

const serializeNodes = (model: ISerializedDiagram): IPipelineConfig['steps'] => {
  const nodesById = indexBy(item => item.id, model.nodes)
  return mapObjIndexed(node => ({
    position: {
      x: node.x,
      y: node.y,
    },
    type: node.type,
    config: node.extras.config,
    command: node.extras.command,
    ports: serializePorts(node.ports),
  }), nodesById)
}

const serializeLinks = (model: ISerializedDiagram): IPipelineConfig['links'] => model.links.map(link => ({
  from: `${link.source}.ports.${link.sourcePort}`,
  to: `${link.target}.ports.${link.targetPort}`,
}))

export const serializePipeline = (model: DiagramModel, name: string): IPipelineConfig => {
  const serializedModel = model.serializeDiagram()
  return {
    name,
    steps: serializeNodes(serializedModel),
    links: serializeLinks(serializedModel),
  }
}
