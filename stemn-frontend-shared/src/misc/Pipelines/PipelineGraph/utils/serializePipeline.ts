import { DiagramModel } from 'mrblenny-storm-react-diagrams'
import { IPipelineConfig } from '../types'
import { indexBy, map, prop } from 'ramda'

type ISerializedDiagram = ReturnType<DiagramModel['serializeDiagram']>


const serializeNodes = (model: ISerializedDiagram): IPipelineConfig['steps']  => {
  const nodesIndexed = indexBy(item => item.id, model.nodes)
  return map(node => ({
    position: {
      x: node.x,
      y: node.y,
    },
    type: node.type,
    ports: {
      in: node.ports.filter(port => port.type === 'input').map(prop('name')),
      out: node.ports.filter(port => port.type === 'output').map(prop('name')),
    }
  }), nodesIndexed)
}

const serializeLinks = (model: ISerializedDiagram): IPipelineConfig['links'] => model.links.map(link => ({
  from: `${link.source}.ports.out[${link.sourcePort}]`,
  to: `${link.target}.ports.in[${link.targetPort}]`,
}))

export const serializePipeline = (model: DiagramModel, name: string): IPipelineConfig => {
  const serializedModel = model.serializeDiagram()
  return {
    name,
    steps: serializeNodes(serializedModel),
    links: serializeLinks(serializedModel),
  }
}
