import { describe, expect, it } from 'vitest'
import reducer from './UserSettings.reducer'

describe('UserSettings reducer', () => {
  const prev = {
    data: { emails: { newsletter: true }, feed: {}, notifications: {}, messages: {}, tips: {} },
    loading: false,
  }

  it('USER_SETTINGS/GET_SETTINGS_PENDING sets loading', () => {
    const next = reducer(prev, { type: 'USER_SETTINGS/GET_SETTINGS_PENDING' })
    expect(next).toEqual({ ...prev, loading: true })
    expect(next.data).toBe(prev.data)
  })

  it('USER_SETTINGS/GET_SETTINGS_REJECTED clears loading', () => {
    const next = reducer({ ...prev, loading: true }, { type: 'USER_SETTINGS/GET_SETTINGS_REJECTED' })
    expect(next.loading).toBe(false)
    expect(next.data).toBe(prev.data)
    expect(reducer(prev, { type: 'USER_SETTINGS/GET_SETTINGS_REJECTED' })).toBe(prev)
  })

  it('USER_SETTINGS/GET_SETTINGS_FULFILLED replaces the settings', () => {
    const data = { emails: { newsletter: false }, feed: {}, notifications: { mentions: true }, messages: {}, tips: {} }
    const next = reducer(
      { ...prev, loading: true },
      { type: 'USER_SETTINGS/GET_SETTINGS_FULFILLED', payload: { data } },
    )
    expect(next).toEqual({ data, loading: false })
    expect(next.data).toBe(data)
  })

  it('returns the same state for unknown actions', () => {
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
