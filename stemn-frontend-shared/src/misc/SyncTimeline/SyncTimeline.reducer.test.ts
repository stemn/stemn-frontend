import { describe, expect, it } from 'vitest'
import { syncTimelineReducer as reducer } from './SyncTimeline.reducer'

const event = (id: string) => ({ _id: id, event: 'revision', timestamp: '2026-01-01T00:00:00.000Z' })

describe('SyncTimeline reducer', () => {
  const prev: any = {
    project1: { loading: false, selected: {}, data: [event('e1'), event('e2')] },
    project2: { loading: false, selected: {}, data: [event('e9')] },
  }

  it('TIMELINE/SELECT_ITEM selects the item', () => {
    const selected = event('e2')
    const next = reducer(prev, { type: 'TIMELINE/SELECT_ITEM', meta: { cacheKey: 'project1' }, payload: { selected } })
    expect(next.project1.selected).toBe(selected)
    expect(next.project1.data).toBe(prev.project1.data)
    expect(next.project2).toBe(prev.project2)
  })

  it('TIMELINE/DESELECT_ITEM clears the selection', () => {
    const selectedState = { ...prev, project1: { ...prev.project1, selected: event('e1') } }
    const next = reducer(selectedState, { type: 'TIMELINE/DESELECT_ITEM', meta: { cacheKey: 'project1' } })
    expect(next.project1.selected).toEqual({})
    expect(next.project2).toBe(prev.project2)
  })

  it('TIMELINE/FETCH_TIMELINE_PENDING and _REJECTED toggle loading', () => {
    const pending = reducer(prev, { type: 'TIMELINE/FETCH_TIMELINE_PENDING', meta: { cacheKey: 'project1' } })
    expect(pending.project1.loading).toBe(true)
    expect(pending.project1.data).toBe(prev.project1.data)
    expect(pending.project2).toBe(prev.project2)
    const rejected = reducer(pending, { type: 'TIMELINE/FETCH_TIMELINE_REJECTED', meta: { cacheKey: 'project1' } })
    expect(rejected.project1.loading).toBe(false)
    expect(reducer(prev, { type: 'TIMELINE/FETCH_TIMELINE_REJECTED', meta: { cacheKey: 'project1' } })).toBe(prev)
  })

  it('TIMELINE/FETCH_TIMELINE_FULFILLED stores the events', () => {
    const data = [event('e3')]
    const next = reducer(prev, {
      type: 'TIMELINE/FETCH_TIMELINE_FULFILLED',
      meta: { cacheKey: 'project3' },
      payload: { data },
    })
    expect(next.project3).toEqual({ data, loading: false })
    expect(next.project1).toBe(prev.project1)
  })

  it('TIMELINE/ADD_EVENT appends the event, creating the list when missing', () => {
    const next = reducer(prev, { type: 'TIMELINE/ADD_EVENT', payload: { cacheKey: 'project1', event: event('e3') } })
    expect(next.project1.data.map((item) => item._id)).toEqual(['e1', 'e2', 'e3'])
    expect(next.project1.data[0]).toBe(prev.project1.data[0])
    expect(prev.project1.data).toHaveLength(2)
    expect(next.project2).toBe(prev.project2)

    const created = reducer(prev, { type: 'TIMELINE/ADD_EVENT', payload: { cacheKey: 'thread1', event: event('e4') } })
    expect(created.thread1).toEqual({ data: [event('e4')] })
  })

  it('TIMELINE/DELETE_EVENT removes the event', () => {
    const next = reducer(prev, { type: 'TIMELINE/DELETE_EVENT', payload: { cacheKey: 'project1', eventId: 'e1' } })
    expect(next.project1.data).toEqual([event('e2')])
    expect(next.project2).toBe(prev.project2)
  })

  it('TIMELINE/DELETE_EVENT returns the same state for an unknown event', () => {
    const action = { type: 'TIMELINE/DELETE_EVENT', payload: { cacheKey: 'project1', eventId: 'unknown' } }
    expect(reducer(prev, action)).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
