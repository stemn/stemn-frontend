import { describe, expect, it } from 'vitest'
import reducer from './AutoLaunch.reducer'

describe('AutoLaunch reducer', () => {
  const prev = { status: false, extra: { checked: true } }

  it('AUTO_LAUNCH/GET_STATUS_FULFILLED stores the status', () => {
    const next = reducer(prev, { type: 'AUTO_LAUNCH/GET_STATUS_FULFILLED', payload: true })
    expect(next).toEqual({ status: true, extra: { checked: true } })
    expect(next).not.toBe(prev)
    expect(next.extra).toBe(prev.extra)
  })

  it('AUTO_LAUNCH/TOGGLE_FULFILLED stores the toggled status', () => {
    const next = reducer(prev, { type: 'AUTO_LAUNCH/TOGGLE_FULFILLED', meta: { status: true } })
    expect(next).toEqual({ status: true, extra: { checked: true } })
    expect(next.extra).toBe(prev.extra)
  })

  it('returns the same state when the status is unchanged or the action is unknown', () => {
    expect(reducer(prev, { type: 'AUTO_LAUNCH/GET_STATUS_FULFILLED', payload: false })).toBe(prev)
    expect(reducer(prev, { type: 'AUTO_LAUNCH/TOGGLE_FULFILLED', meta: { status: false } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
