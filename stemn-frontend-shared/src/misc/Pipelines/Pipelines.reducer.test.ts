import { describe, expect, it } from 'vitest'
import reducer from './Pipelines.reducer'

const step = (id: string, status = 'complete') => ({ _id: id, name: `Step ${id}`, status })
const pipeline = (id: string, steps = [step(`${id}-s1`)]) => ({
  _id: id,
  name: `Pipeline ${id}`,
  status: 'complete',
  stages: [{ name: 'build', steps }],
})

describe('Pipelines reducer', () => {
  const prev: any = {
    hydrated: true,
    lastPipelinesRequest: { cacheKey: 'project1', projectId: 'project1' },
    pipelines: { project1: { loading: false, data: ['pipe1'] }, project2: { loading: false, data: [] } },
    pipelineData: {
      pipe1: { loading: false, rerunPending: false, data: { _id: 'pipe1', name: 'Old', extra: 'kept', stages: [] } },
      pipe9: { loading: false, data: { _id: 'pipe9' } },
    },
    stepData: { 'pipe1-s1': { loading: false, data: step('pipe1-s1', 'running') }, other: { loading: false } },
  }

  it('hydrates a persisted state with the initial keys', () => {
    const next = reducer({ pipelines: {} }, { type: 'OTHER' })
    expect(next).toMatchObject({ pipelines: {}, pipelineData: {}, stepData: {}, hydrated: true })
  })

  it('PIPELINES/GET_PIPELINES_PENDING sets loading and remembers the request', () => {
    const next = reducer(prev, {
      type: 'PIPELINES/GET_PIPELINES_PENDING',
      meta: { cacheKey: 'project2', projectId: 'project2' },
    })
    expect(next.pipelines.project2).toEqual({ loading: true, data: [] })
    expect(next.lastPipelinesRequest).toEqual({ cacheKey: 'project2', projectId: 'project2' })
    expect(next.pipelines.project1).toBe(prev.pipelines.project1)
    expect(next.pipelineData).toBe(prev.pipelineData)
  })

  it('PIPELINES/GET_PIPELINES_REJECTED clears loading', () => {
    const next = reducer(prev, { type: 'PIPELINES/GET_PIPELINES_REJECTED', meta: { cacheKey: 'project3' } })
    expect(next.pipelines.project3).toEqual({ loading: false })
    expect(next.pipelines.project1).toBe(prev.pipelines.project1)
  })

  it('PIPELINES/GET_PIPELINES_FULFILLED stores ids and deep-merges pipelines and steps', () => {
    const data = [pipeline('pipe1'), pipeline('pipe2')]
    const next = reducer(prev, {
      type: 'PIPELINES/GET_PIPELINES_FULFILLED',
      meta: { cacheKey: 'project1' },
      payload: { data },
    })
    expect(next.pipelines.project1).toEqual({ loading: false, data: ['pipe1', 'pipe2'] })
    expect(next.pipelines.project2).toBe(prev.pipelines.project2)
    // Existing keys survive the deep merge, stages are replaced by step ids
    expect(next.pipelineData.pipe1).toEqual({
      loading: false,
      rerunPending: false,
      data: {
        _id: 'pipe1',
        name: 'Pipeline pipe1',
        extra: 'kept',
        status: 'complete',
        stages: [{ name: 'build', steps: ['pipe1-s1'] }],
      },
    })
    expect(next.pipelineData.pipe2.data.stages).toEqual([{ name: 'build', steps: ['pipe2-s1'] }])
    expect(next.pipelineData.pipe9).toBe(prev.pipelineData.pipe9)
    expect(next.stepData['pipe1-s1']).toEqual({ loading: false, data: step('pipe1-s1') })
    expect(next.stepData['pipe2-s1']).toEqual({ loading: false, data: step('pipe2-s1') })
    expect(next.stepData.other).toBe(prev.stepData.other)
  })

  it('PIPELINES/GET_PIPELINE_PENDING and _REJECTED toggle loading', () => {
    const pending = reducer(prev, { type: 'PIPELINES/GET_PIPELINE_PENDING', meta: { cacheKey: 'pipe1' } })
    expect(pending.pipelineData.pipe1.loading).toBe(true)
    expect(pending.pipelineData.pipe1.data).toBe(prev.pipelineData.pipe1.data)
    expect(pending.pipelineData.pipe9).toBe(prev.pipelineData.pipe9)
    expect(pending.stepData).toBe(prev.stepData)
    const rejected = reducer(pending, { type: 'PIPELINES/GET_PIPELINE_REJECTED', meta: { cacheKey: 'pipe1' } })
    expect(rejected.pipelineData.pipe1.loading).toBe(false)
  })

  it('PIPELINES/GET_PIPELINE_FULFILLED deep-merges the pipeline and its steps', () => {
    const next = reducer(prev, { type: 'PIPELINES/GET_PIPELINE_FULFILLED', payload: { data: pipeline('pipe1') } })
    expect(next.pipelineData.pipe1.data.extra).toBe('kept')
    expect(next.pipelineData.pipe1.data.name).toBe('Pipeline pipe1')
    expect(next.pipelineData.pipe9).toBe(prev.pipelineData.pipe9)
    expect(next.stepData['pipe1-s1'].data.status).toBe('complete')
    expect(next.stepData.other).toBe(prev.stepData.other)
    expect(next.pipelines).toBe(prev.pipelines)
  })

  it.each([
    ['PIPELINES/RERUN_PIPELINE_PENDING', 'rerunPending', true],
    ['PIPELINES/RERUN_PIPELINE_REJECTED', 'rerunPending', false],
    ['PPIPELINES/RERUN_PIPELINE_FULFILLED', 'rerunPending', false],
    ['PIPELINES/CANCEL_PIPELINE_PENDING', 'cancelPending', true],
    ['PIPELINES/CANCEL_PIPELINE_REJECTED', 'cancelPending', false],
    ['PIPELINES/CANCEL_PIPELINE_FULFILLED', 'cancelPending', false],
  ])('%s sets %s', (type, key, value) => {
    const start = {
      ...prev,
      pipelineData: { ...prev.pipelineData, pipe1: { ...prev.pipelineData.pipe1, [key]: !value } },
    }
    const next = reducer(start, { type, meta: { pipelineId: 'pipe1' } })
    expect(next.pipelineData.pipe1[key]).toBe(value)
    expect(next.pipelineData.pipe1.data).toBe(prev.pipelineData.pipe1.data)
    expect(next.pipelineData.pipe9).toBe(prev.pipelineData.pipe9)
  })

  it('PIPELINES/GET_STEP_PENDING and _REJECTED toggle loading', () => {
    const pending = reducer(prev, { type: 'PIPELINES/GET_STEP_PENDING', meta: { cacheKey: 'pipe1-s1' } })
    expect(pending.stepData['pipe1-s1'].loading).toBe(true)
    expect(pending.stepData.other).toBe(prev.stepData.other)
    const rejected = reducer(pending, { type: 'PIPELINES/GET_STEP_REJECTED', meta: { cacheKey: 'pipe1-s1' } })
    expect(rejected.stepData['pipe1-s1'].loading).toBe(false)
  })

  it('PIPELINES/GET_STEP_FULFILLED stores the step', () => {
    const data = step('pipe1-s1', 'failed')
    const next = reducer(prev, { type: 'PIPELINES/GET_STEP_FULFILLED', payload: { data } })
    expect(next.stepData['pipe1-s1']).toEqual({ loading: false, data })
    expect(next.stepData.other).toBe(prev.stepData.other)
    expect(next.pipelineData).toBe(prev.pipelineData)
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'PIPELINES/GET_STEP_REJECTED', meta: { cacheKey: 'pipe1-s1' } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
