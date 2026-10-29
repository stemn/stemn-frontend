// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { pipelineConfigFixture } from 'stemn-shared/misc/Pipelines/PipelineGraph/fixtures'
import {
  createDiagramEngine,
  deserializePipeline,
  serializePipeline,
} from 'stemn-shared/misc/Pipelines/PipelineGraph/utils'

describe('deserializePipeline', () => {
  it('can deserialize and reserialize a pipeline', () => {
    // one node factory per step type, like PipelineGraph does with the project's steps
    const diagramEngine = createDiagramEngine(Object.values(pipelineConfigFixture.steps) as any)
    const diagram = deserializePipeline('diagramId', pipelineConfigFixture, diagramEngine)
    expect(serializePipeline(diagram, pipelineConfigFixture.name)).toEqual(pipelineConfigFixture)
  })
})
