import { describe, expect, it } from 'vitest'
import reducer from './Autosuggest.reducer'

const suggestions = [{ _id: 'u1', name: 'Ada' }]

describe('Autosuggest reducer', () => {
  const prev: any = {
    users: { value: 'ad', suggestions: [{ _id: 'u0' }], isLoading: false },
    fields: { value: '', suggestions: [], isLoading: false },
  }

  it('AUTO_SUGGEST/UPDATE_INPUT stores the value', () => {
    const next = reducer(prev, {
      type: 'AUTO_SUGGEST/UPDATE_INPUT',
      meta: { cacheKey: 'users' },
      payload: { value: 'ada' },
    })
    expect(next.users).toEqual({ ...prev.users, value: 'ada' })
    expect(next.users.suggestions).toBe(prev.users.suggestions)
    expect(next.fields).toBe(prev.fields)
  })

  it('AUTO_SUGGEST/CLEAR_SUGGESTIONS empties the suggestions', () => {
    const next = reducer(prev, { type: 'AUTO_SUGGEST/CLEAR_SUGGESTIONS', meta: { cacheKey: 'users' } })
    expect(next.users.suggestions).toEqual([])
    expect(next.fields).toBe(prev.fields)
  })

  it('AUTO_SUGGEST/GET_SUGGESTIONS_PENDING sets isLoading', () => {
    const next = reducer(prev, { type: 'AUTO_SUGGEST/GET_SUGGESTIONS_PENDING', meta: { cacheKey: 'tags' } })
    expect(next.tags).toEqual({ isLoading: true })
    expect(next.users).toBe(prev.users)
  })

  it('AUTO_SUGGEST/GET_SUGGESTIONS_FULFILLED stores the suggestions', () => {
    const next = reducer(prev, {
      type: 'AUTO_SUGGEST/GET_SUGGESTIONS_FULFILLED',
      meta: { cacheKey: 'users' },
      payload: { data: suggestions },
    })
    expect(next.users).toEqual({ value: 'ad', suggestions, isLoading: false })
    expect(next.fields).toBe(prev.fields)
  })

  it('returns the same state when nothing changes', () => {
    const action = { type: 'AUTO_SUGGEST/UPDATE_INPUT', meta: { cacheKey: 'users' }, payload: { value: 'ad' } }
    expect(reducer(prev, action)).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
