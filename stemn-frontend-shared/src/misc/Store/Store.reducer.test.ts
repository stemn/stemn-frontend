import { describe, expect, it } from 'vitest'
import reducer from './Store.reducer'

describe('Store reducer', () => {
  const prev: any = {
    projectSettings: { name: 'Bracket', tags: ['cad', 'robotics'], permissions: { role: 'admin' } },
    search: { query: 'gear' },
  }

  it('STORE/CHANGE sets the value at the model path', () => {
    const next = reducer(prev, { type: 'STORE/CHANGE', payload: { model: 'projectSettings.name', value: 'Gear' } })
    expect(next.projectSettings).toEqual({ ...prev.projectSettings, name: 'Gear' })
    expect(next.projectSettings.tags).toBe(prev.projectSettings.tags)
    expect(next.search).toBe(prev.search)
  })

  it('STORE/CHANGE creates missing intermediates as objects, even for index keys', () => {
    const next = reducer(prev, { type: 'STORE/CHANGE', payload: { model: 'newForm.items[0].name', value: 'a' } })
    expect(next.newForm).toEqual({ items: { 0: { name: 'a' } } })
    expect(Array.isArray(next.newForm.items)).toBe(false)
    expect(next.projectSettings).toBe(prev.projectSettings)
  })

  it('STORE/CHANGE with an empty model replaces the whole store', () => {
    const value = { fresh: true }
    expect(reducer(prev, { type: 'STORE/CHANGE', payload: { model: '', value } })).toBe(value)
  })

  it('STORE/CHANGE returns the same state when the value is unchanged', () => {
    expect(reducer(prev, { type: 'STORE/CHANGE', payload: { model: 'search.query', value: 'gear' } })).toBe(prev)
  })

  it('STORE/LOAD sets the value at the model path', () => {
    const value = { query: 'motor', page: 2 }
    const next = reducer(prev, { type: 'STORE/LOAD', payload: { model: 'search', value } })
    expect(next.search).toBe(value)
    expect(next.projectSettings).toBe(prev.projectSettings)
  })

  it('STORE/PUSH appends an item, creating the array when missing', () => {
    const next = reducer(prev, { type: 'STORE/PUSH', payload: { model: 'projectSettings.tags', item: 'pcb' } })
    expect(next.projectSettings.tags).toEqual(['cad', 'robotics', 'pcb'])
    expect(prev.projectSettings.tags).toEqual(['cad', 'robotics'])
    expect(next.projectSettings.permissions).toBe(prev.projectSettings.permissions)
    expect(next.search).toBe(prev.search)

    const created = reducer(prev, { type: 'STORE/PUSH', payload: { model: 'search.history', item: 'gear' } })
    expect(created.search).toEqual({ query: 'gear', history: ['gear'] })
  })

  it('STORE/REMOVE removes the item at the index', () => {
    const next = reducer(prev, { type: 'STORE/REMOVE', payload: { model: 'projectSettings.tags', index: 0 } })
    expect(next.projectSettings.tags).toEqual(['robotics'])
    expect(prev.projectSettings.tags).toEqual(['cad', 'robotics'])
    expect(next.search).toBe(prev.search)
  })

  it('returns the same state for unknown actions', () => {
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
