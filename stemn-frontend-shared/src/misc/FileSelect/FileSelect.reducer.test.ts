import { describe, expect, it } from 'vitest'
import reducer from './FileSelect.reducer'

const file = { fileId: 'file1', name: 'part.sldprt', path: 'cad/part.sldprt' }

describe('FileSelect reducer', () => {
  const prev = {
    'project1-select': { path: 'cad', selected: { fileId: 'old' } },
    'project2-select': { path: '', selected: {} },
  }

  it('FILE_SELECT/INIT sets the path, creating the store key', () => {
    const next = reducer({}, { type: 'FILE_SELECT/INIT', meta: { storeKey: 'new' }, payload: { path: 'docs' } })
    expect(next).toEqual({ new: { path: 'docs' } })

    const updated = reducer(prev, {
      type: 'FILE_SELECT/INIT',
      meta: { storeKey: 'project1-select' },
      payload: { path: 'docs' },
    })
    expect(updated['project1-select']).toEqual({ path: 'docs', selected: { fileId: 'old' } })
    expect(updated['project1-select'].selected).toBe(prev['project1-select'].selected)
    expect(updated['project2-select']).toBe(prev['project2-select'])
  })

  it('FILE_SELECT/SELECT selects a file', () => {
    const next = reducer(prev, { type: 'FILE_SELECT/SELECT', meta: { storeKey: 'project1-select' }, payload: { file } })
    expect(next['project1-select']).toEqual({ path: 'cad', selected: file })
    expect(next['project1-select'].selected).toBe(file)
    expect(next['project2-select']).toBe(prev['project2-select'])
  })

  it('FILE_SELECT/DESELECT resets the selection', () => {
    const next = reducer(prev, { type: 'FILE_SELECT/DESELECT', meta: { storeKey: 'project1-select' } })
    expect(next['project1-select']).toEqual({ path: 'cad', selected: {} })
    expect(next['project2-select']).toBe(prev['project2-select'])
  })

  it('FILE_SELECT/CHANGE_PATH changes the path', () => {
    const next = reducer(prev, {
      type: 'FILE_SELECT/CHANGE_PATH',
      meta: { storeKey: 'project2-select' },
      payload: { path: 'cad/assemblies' },
    })
    expect(next['project2-select']).toEqual({ path: 'cad/assemblies', selected: {} })
    expect(next['project1-select']).toBe(prev['project1-select'])
  })

  it('returns the same state for an unchanged path and unknown actions', () => {
    const action = { type: 'FILE_SELECT/CHANGE_PATH', meta: { storeKey: 'project1-select' }, payload: { path: 'cad' } }
    expect(reducer(prev, action)).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
