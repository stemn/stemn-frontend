import { DiagramModel } from 'mrblenny-storm-react-diagrams'
import { IPipelineConfig } from '../types'
import { indexBy, map } from 'ramda'

type ISerializedDiagram = ReturnType<DiagramModel['serializeDiagram']>


const serializeNodes = (model: ISerializedDiagram): IPipelineConfig['steps']  => {
  const nodesIndexed = indexBy(item => item.id, model.nodes)
  return map((node: ({ x: number, y: number, type: string, ports: any[] })) => ({
    position: {
      x: node.x,
      y: node.y,
    },
    type: node.type,
    ports: {
      in: ['in'],
      out: ['out'],
    }
  }), nodesIndexed)
}

const serializeLinks = (model: ISerializedDiagram): IPipelineConfig['links'] => model.links.map(link => ({
  from: `${link.source}.ports.in.${link.sourcePort}`,
  to: `${link.source}.ports.out.${link.sourcePort}`,
}))

export const serializePipeline = (model: DiagramModel, name: string): IPipelineConfig => {
  const serializedModel = model.serializeDiagram()
  return {
    name,
    steps: serializeNodes(serializedModel),
    links: serializeLinks(serializedModel),
  }
}
