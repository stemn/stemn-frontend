import { describe, expect, it } from 'vitest'
import { pipelineGraphReducer as reducer } from './PipelineGraph.reducer'

const model = {
  name: 'Render on commit',
  steps: { trigger: { type: 'stemn/file-commit' }, render: { type: 'stemn/render' } },
  links: [{ from: 'trigger.ports.out', to: 'render.ports.in' }],
}

describe('PipelineGraph reducer', () => {
  const prev: any = {
    diagrams: {
      diagram1: { selectedStep: 'trigger', model },
      diagram2: { selectedStep: '', model: { name: 'Other', steps: {}, links: [] } },
    },
    steps: [{ type: 'stemn/upload', name: 'Upload files', category: 'action' }],
  }

  it('PIPELINE_DIAGRAM/INITIALISE_MODEL stores the model', () => {
    const next = reducer(prev, { type: 'PIPELINE_DIAGRAM/INITIALISE_MODEL', payload: { diagramId: 'diagram3', model } })
    expect(next.diagrams.diagram3).toEqual({ model })
    expect(next.diagrams.diagram1).toBe(prev.diagrams.diagram1)
    expect(next.steps).toBe(prev.steps)
  })

  it('PIPELINE_DIAGRAM/SELECT_STEP selects the step', () => {
    const next = reducer(prev, {
      type: 'PIPELINE_DIAGRAM/SELECT_STEP',
      payload: { diagramId: 'diagram1', stepId: 'render' },
    })
    expect(next.diagrams.diagram1).toEqual({ selectedStep: 'render', model })
    expect(next.diagrams.diagram1.model).toBe(model)
    expect(next.diagrams.diagram2).toBe(prev.diagrams.diagram2)
  })

  it('PIPELINE_DIAGRAM/ADD_STEP adds the step to the model', () => {
    const step = { type: 'stemn/send-email', config: { to: 'team@example.com' } }
    const next = reducer(prev, {
      type: 'PIPELINE_DIAGRAM/ADD_STEP',
      payload: { diagramId: 'diagram1', stepId: 'email', step },
    })
    expect(next.diagrams.diagram1.model.steps).toEqual({ ...model.steps, email: step })
    expect(next.diagrams.diagram1.model.steps.render).toBe(model.steps.render)
    expect(next.diagrams.diagram1.model.links).toBe(model.links)
    expect(model.steps).not.toHaveProperty('email')
    expect(next.diagrams.diagram2).toBe(prev.diagrams.diagram2)
  })

  it('returns the same state when nothing changes', () => {
    const action = { type: 'PIPELINE_DIAGRAM/SELECT_STEP', payload: { diagramId: 'diagram1', stepId: 'trigger' } }
    expect(reducer(prev, action)).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
