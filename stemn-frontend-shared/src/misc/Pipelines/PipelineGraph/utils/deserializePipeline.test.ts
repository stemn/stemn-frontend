import { deserializePipeline, serializePipeline, createDiagramEngine } from './'
import { pipelineConfigFixture } from '../fixtures'

describe('deserializePipeline', () => {
  it('can deserialize and reserialize a pipeline', () => {
    const diagramEngine = createDiagramEngine()
    const diagram = deserializePipeline('diagramId', pipelineConfigFixture, diagramEngine)
    expect(serializePipeline(diagram, pipelineConfigFixture.name))
      .toEqual(pipelineConfigFixture)
  })
})
