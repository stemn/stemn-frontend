import { LinkModel, PortModel, DefaultLinkModel, DiagramEngine } from 'mrblenny-storm-react-diagrams'
import { merge, find } from 'lodash'

export class PipelineGraphPortModel extends PortModel {
	value?: string;

	deSerialize(data: any, engine: DiagramEngine) {
		super.deSerialize(data, engine)
		this.value = data.value
	}

	serialize() {
		return merge(super.serialize(), {
			value: this.value
		})
	}

	createLinkModel(): LinkModel {
		return new DefaultLinkModel();
	}

	canLinkToPort(port: PortModel) {
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
