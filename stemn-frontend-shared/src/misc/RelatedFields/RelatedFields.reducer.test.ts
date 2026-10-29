import { describe, expect, it } from 'vitest'
import reducer from './RelatedFields.reducer'

const related = [{ _id: 'field2', name: 'Robotics' }]

describe('RelatedFields reducer', () => {
  const prev = {
    field1: { loading: false, data: [{ _id: 'field3' }] },
    field9: { loading: false, data: [] },
  }

  it('RELATED_FIELDS/GET_RELATED_FIELDS_PENDING marks the field as loading', () => {
    const next = reducer(prev, { type: 'RELATED_FIELDS/GET_RELATED_FIELDS_PENDING', meta: { fieldId: 'field1' } })
    expect(next.field1).toEqual({ loading: true, data: [{ _id: 'field3' }] })
    expect(next.field1.data).toBe(prev.field1.data)
    expect(next.field9).toBe(prev.field9)
  })

  it('RELATED_FIELDS/GET_RELATED_FIELDS_REJECTED keeps loading set (existing behaviour)', () => {
    const next = reducer(prev, { type: 'RELATED_FIELDS/GET_RELATED_FIELDS_REJECTED', meta: { fieldId: 'field1' } })
    expect(next.field1.loading).toBe(true)
    expect(next.field9).toBe(prev.field9)
  })

  it('RELATED_FIELDS/GET_RELATED_FIELDS_FULFILLED stores the related fields', () => {
    const next = reducer(prev, {
      type: 'RELATED_FIELDS/GET_RELATED_FIELDS_FULFILLED',
      meta: { fieldId: 'field1' },
      payload: { data: related },
    })
    expect(next.field1).toEqual({ loading: false, data: related })
    expect(next.field9).toBe(prev.field9)
  })

  it('returns the same state when nothing changes', () => {
    const action = {
      type: 'RELATED_FIELDS/GET_RELATED_FIELDS_FULFILLED',
      meta: { fieldId: 'field1' },
      payload: { data: prev.field1.data },
    }
    expect(reducer(prev, action)).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
