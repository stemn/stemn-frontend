import { describe, expect, it } from 'vitest'
import { fileListReducer as reducer } from './FileList.reducer'

const entries = [{ fileId: 'f1', name: 'part.step' }]
const folder = { fileId: 'folder1', name: 'cad', path: 'cad' }

describe('FileList reducer', () => {
  const prev: any = {
    'project1-cad': { loading: false, entries: [{ fileId: 'old' }], folder: { fileId: 'folder0' }, query: '' },
    'project2-': { loading: false, entries: [], folder: {}, query: '' },
  }

  it.each(['FETCH_FILES', 'EXPLORE_FOLDER', 'SEARCH'])('FILE_LIST/%s_PENDING and _REJECTED toggle loading', (base) => {
    const pending = reducer(prev, { type: `FILE_LIST/${base}_PENDING`, meta: { cacheKey: 'project1-cad' } })
    expect(pending['project1-cad']).toEqual({ ...prev['project1-cad'], loading: true })
    expect(pending['project1-cad'].entries).toBe(prev['project1-cad'].entries)
    expect(pending['project2-']).toBe(prev['project2-'])
    const rejected = reducer(pending, { type: `FILE_LIST/${base}_REJECTED`, meta: { cacheKey: 'project1-cad' } })
    expect(rejected['project1-cad'].loading).toBe(false)
    expect(reducer(prev, { type: `FILE_LIST/${base}_REJECTED`, meta: { cacheKey: 'project1-cad' } })).toBe(prev)
  })

  it.each(['FETCH_FILES', 'EXPLORE_FOLDER'])('FILE_LIST/%s_FULFILLED stores the entries and folder', (base) => {
    const next = reducer(prev, {
      type: `FILE_LIST/${base}_FULFILLED`,
      meta: { cacheKey: 'project1-cad' },
      payload: { data: { entries, folder } },
    })
    expect(next['project1-cad']).toEqual({ loading: false, entries, folder, query: '' })
    expect(next['project1-cad'].entries).toBe(entries)
    expect(next['project2-']).toBe(prev['project2-'])
  })

  it('FILE_LIST/SEARCH_FULFILLED stores the search results', () => {
    const data = [{ fileId: 'f2', name: 'gear.step' }]
    const next = reducer(prev, { type: 'FILE_LIST/SEARCH_FULFILLED', meta: { cacheKey: 'search' }, payload: { data } })
    expect(next.search).toEqual({ search: data, loading: false })
    expect(next['project1-cad']).toBe(prev['project1-cad'])
  })

  it('returns the same state for unknown actions', () => {
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
