import { NodeModel } from 'mrblenny-storm-react-diagrams'
// import { PipelineGraphPortModel } from '../PipelineGraphPort'

export class PipelineGraphStepModel extends NodeModel {
  constructor (nodeType: string) {
    super(nodeType)
    // this.addPort(new PipelineGraphPortModel('thing', 'input'))
  }
}
