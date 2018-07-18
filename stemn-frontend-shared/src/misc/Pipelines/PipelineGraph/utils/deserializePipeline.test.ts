import { pipelineConfigFixture } from 'stemn-shared/misc/Pipelines/PipelineGraph/fixtures'
import { createDiagramEngine, deserializePipeline, serializePipeline } from 'stemn-shared/misc/Pipelines/PipelineGraph/utils'

describe('deserializePipeline', () => {
  it('can deserialize and reserialize a pipeline', () => {
    const diagramEngine = createDiagramEngine([])
    const diagram = deserializePipeline('diagramId', pipelineConfigFixture, diagramEngine)
    expect(serializePipeline(diagram, pipelineConfigFixture.name))
      .toEqual(pipelineConfigFixture)
  })
})
