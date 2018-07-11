import { LinkModel, PortModel, DefaultLinkModel } from 'mrblenny-storm-react-diagrams'

export class PipelineGraphPortModel extends PortModel {
	position: string | "top" | "bottom" | "left" | "right";

	constructor(pos: string = "top") {
		super(pos, "diamond");
		this.position = pos;
	}

	createLinkModel(): LinkModel {
		return new DefaultLinkModel();
	}
}