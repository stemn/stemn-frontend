import { LinkModel, PortModel, DefaultLinkModel, DiagramEngine } from 'mrblenny-storm-react-diagrams'

export class PipelineGraphPortModel extends PortModel {
	value?: string;

	constructor(pos: string = "top") {
		super(pos, "diamond");
	}

	deSerialize(data: any, engine: DiagramEngine) {
		super.deSerialize(data, engine)
		this.value = data.value
	}

	createLinkModel(): LinkModel {
		return new DefaultLinkModel();
	}
}