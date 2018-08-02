import { find, merge } from 'lodash'
import { DefaultLinkModel, DiagramEngine, LinkModel, PortModel } from 'mrblenny-storm-react-diagrams'

export class PipelineGraphPortModel extends PortModel {
  public value?: string

  public deSerialize (data: any, engine: DiagramEngine) {
    super.deSerialize(data, engine)
    this.value = data.value
  }

  public serialize () {
    return merge(super.serialize(), {
      value: this.value,
    })
  }

  public createLinkModel (): LinkModel {
    return new DefaultLinkModel()
  }

  public canLinkToPort (port: PortModel) {
    const ports = [port, this]
    const inputPort = find(ports, ['type', 'input'])
    const outputPort = find(ports, ['type', 'output'])
    // Port type must differ. i.e. input -> output
    const isInputToOutput = inputPort && outputPort
    // Output can only go to 1 input
    const isOutputToSingleInput = outputPort && Object.keys(outputPort.links).length === 1

    if (isOutputToSingleInput && isInputToOutput) {
      return true
    }
    return false
  }
}
