import { NodeModel, DiagramEngine } from 'mrblenny-storm-react-diagrams'
// import { PipelineGraphPortModel } from "../PipelineGraphPort";

export class PipelineGraphStepModel extends NodeModel {
	constructor(nodeType: string) {
		super(nodeType);
		// this.addPort(new PipelineGraphPortModel("top"));
		// this.addPort(new PipelineGraphPortModel("left"));
		// this.addPort(new PipelineGraphPortModel("bottom"));
		// this.addPort(new PipelineGraphPortModel("right"));
	}
	serialize() {
		return super.serialize()
	}

	deSerialize(data: any, engine: DiagramEngine) {
		console.log(data)
		super.deSerialize(data, engine);
	}
}