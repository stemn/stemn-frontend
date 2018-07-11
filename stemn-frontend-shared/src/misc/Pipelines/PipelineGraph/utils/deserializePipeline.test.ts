import { deserializePipeline, serializePipeline, createDiagramEngine } from './'
import { pipelineConfigFixture } from '../fixtures'
import { DiagramModel } from 'mrblenny-storm-react-diagrams';

describe('deserializePipeline', () => {
  let diagram: DiagramModel
  it('can deserialize a pipeline', () => {
    const diagramEngine = createDiagramEngine()
    diagram = deserializePipeline(pipelineConfigFixture, diagramEngine)
    expect(diagram)
      .toMatchSnapshot()
  })

  it('can serialize the pipeline', () => {
    expect(serializePipeline(diagram, pipelineConfigFixture.name))
      .toEqual(pipelineConfigFixture)
  })
})
