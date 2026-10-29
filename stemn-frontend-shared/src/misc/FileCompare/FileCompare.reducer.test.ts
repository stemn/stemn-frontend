import { describe, expect, it } from 'vitest'
import { fileCompareReducer as reducer } from './FileCompare.reducer'

const revision = (id: string) => ({ _id: id, fileId: 'file1', revisionId: id, name: 'part.step' })

describe('FileCompare reducer', () => {
  const prev: any = {
    file1: { edit: false, mode: 'sideBySide', selected1: revision('r1'), selected2: revision('r2'), lastSelected: 1 },
    file2: { edit: false, mode: 'single', selected1: revision('r9'), lastSelected: 1 },
  }

  it('FILE_COMPARE/INIT initialises the comparison', () => {
    const selected1 = revision('r3')
    const next = reducer(prev, {
      type: 'FILE_COMPARE/INIT',
      meta: { cacheKey: 'file3' },
      payload: { mode: 'single', selected1, selected2: undefined },
    })
    expect(next.file3).toEqual({ edit: false, mode: 'single', selected1, selected2: undefined, lastSelected: 1 })
    expect(next.file1).toBe(prev.file1)
  })

  it('FILE_COMPARE/SELECT sets the selected revision and lastSelected', () => {
    const file = revision('r4')
    const next = reducer(prev, {
      type: 'FILE_COMPARE/SELECT',
      meta: { cacheKey: 'file1' },
      payload: { file, selectedKey: 2 },
    })
    expect(next.file1).toEqual({ ...prev.file1, selected2: file, lastSelected: 2 })
    expect(next.file1.selected1).toBe(prev.file1.selected1)
    expect(next.file2).toBe(prev.file2)
  })

  it('FILE_COMPARE/CHANGE_MODE deep-merges the mode into the entry', () => {
    const next = reducer(prev, {
      type: 'FILE_COMPARE/CHANGE_MODE',
      meta: { cacheKey: 'file1' },
      payload: { mode: 'slider' },
    })
    expect(next.file1).toEqual({ ...prev.file1, mode: 'slider' })
    expect(next.file1.selected1).toBe(prev.file1.selected1)
    expect(next.file2).toBe(prev.file2)

    const created = reducer(prev, {
      type: 'FILE_COMPARE/CHANGE_MODE',
      meta: { cacheKey: 'file9' },
      payload: { mode: 'single' },
    })
    expect(created.file9).toEqual({ mode: 'single' })
  })

  it('FILE_COMPARE/CHANGE_MODE returns the same state when the mode is unchanged', () => {
    const action = { type: 'FILE_COMPARE/CHANGE_MODE', meta: { cacheKey: 'file1' }, payload: { mode: 'sideBySide' } }
    expect(reducer(prev, action)).toBe(prev)
  })

  it('FILE_COMPARE/EDIT_TOGGLE toggles editActive', () => {
    const on = reducer(prev, { type: 'FILE_COMPARE/EDIT_TOGGLE', meta: { cacheKey: 'file1' } })
    expect(on.file1.editActive).toBe(true)
    expect(on.file2).toBe(prev.file2)
    const off = reducer(on, { type: 'FILE_COMPARE/EDIT_TOGGLE', meta: { cacheKey: 'file1' } })
    expect(off.file1.editActive).toBe(false)
  })

  it('returns the same state for unknown actions', () => {
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
