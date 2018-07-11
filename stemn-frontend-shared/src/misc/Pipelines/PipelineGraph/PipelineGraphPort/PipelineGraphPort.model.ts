import { LinkModel, PortModel, DefaultLinkModel, DiagramEngine } from 'mrblenny-storm-react-diagrams'
import { merge } from 'lodash'

export class PipelineGraphPortModel extends PortModel {
	value?: string;

	constructor(pos: string = "top") {
		super(pos, "diamond");
	}

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
}