import { describe, expect, it } from 'vitest'
import reducer from './Fields.reducer'

const field = { _id: 'field1', name: 'Robotics', blurb: 'Robots' }

describe('Fields reducer', () => {
  const prev: any = {
    data: {
      field1: { loading: false, dataSize: 'sm', data: { _id: 'field1', name: 'Robotics' } },
      field2: { loading: false, data: { _id: 'field2' } },
    },
    newFieldForm: { name: 'Draft', blurb: 'Draft blurb' },
    newFieldFormPending: false,
  }

  it('FIELDS/GET_FIELD_PENDING and _REJECTED toggle loading', () => {
    const pending = reducer(prev, { type: 'FIELDS/GET_FIELD_PENDING', meta: { fieldId: 'field1' } })
    expect(pending.data.field1).toEqual({ ...prev.data.field1, loading: true })
    expect(pending.data.field1.data).toBe(prev.data.field1.data)
    expect(pending.data.field2).toBe(prev.data.field2)
    expect(pending.newFieldForm).toBe(prev.newFieldForm)
    const rejected = reducer(pending, { type: 'FIELDS/GET_FIELD_REJECTED', meta: { fieldId: 'field1' } })
    expect(rejected.data.field1.loading).toBe(false)
  })

  it('FIELDS/GET_FIELD_FULFILLED replaces the field entry', () => {
    const next = reducer(prev, {
      type: 'FIELDS/GET_FIELD_FULFILLED',
      meta: { fieldId: 'field1', size: 'lg' },
      payload: { data: field },
    })
    expect(next.data.field1).toEqual({ loading: false, dataSize: 'lg', data: field })
    expect(next.data.field2).toBe(prev.data.field2)
  })

  it('FIELDS/CREATE_FIELD_PENDING and _REJECTED toggle newFieldFormPending', () => {
    const pending = reducer(prev, { type: 'FIELDS/CREATE_FIELD_PENDING' })
    expect(pending.newFieldFormPending).toBe(true)
    expect(pending.data).toBe(prev.data)
    const rejected = reducer(pending, { type: 'FIELDS/CREATE_FIELD_REJECTED' })
    expect(rejected.newFieldFormPending).toBe(false)
    expect(rejected.newFieldForm).toBe(prev.newFieldForm)
  })

  it('FIELDS/CREATE_FIELD_FULFILLED resets the form', () => {
    const next = reducer({ ...prev, newFieldFormPending: true }, { type: 'FIELDS/CREATE_FIELD_FULFILLED' })
    expect(next.newFieldFormPending).toBe(false)
    expect(next.newFieldForm).toEqual({ name: '', blurb: '' })
    expect(next.data).toBe(prev.data)
  })

  it.each([
    ['FIELDS/SAVE_FIELD_PENDING', true],
    ['FIELDS/SAVE_FIELD_REJECTED', false],
    ['FIELDS/SAVE_FIELD_FULFILLED', false],
  ])('%s sets savePending', (type, savePending) => {
    const next = reducer(prev, { type, meta: { fieldId: 'field2' } })
    expect(next.data.field2).toEqual({ ...prev.data.field2, savePending })
    expect(next.data.field1).toBe(prev.data.field1)
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'FIELDS/CREATE_FIELD_REJECTED' })).toBe(prev)
    expect(reducer(prev, { type: 'FIELDS/GET_FIELD_REJECTED', meta: { fieldId: 'field1' } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
