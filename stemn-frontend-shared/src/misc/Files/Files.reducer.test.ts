import { describe, expect, it } from 'vitest'
import { filesReducer as reducer } from './Files.reducer'

const makeState = (): any => ({
  hydrated: true,
  fileData: { 'file1-rev1': { loading: false, data: 'solid cube' }, other: { loading: false } },
  fileRenders: { 'file1-rev1': { loading: false, data: 'render' }, other: { loading: false } },
  fileMeta: {
    'file1-rev1': { loading: false, data: { fileId: 'file1', name: 'cube.step' } },
    other: { loading: false },
  },
  fileAssemblyParts: { file1: { loading: false, data: [] }, other: { loading: false } },
  fileAssemblyParents: { file1: { loading: false, data: [] }, other: { loading: false } },
  pathToId: { 'project1/cad/cube.step': { loading: false, data: 'file1' }, other: { loading: false } },
  downloadProgress: { file1: 10 },
  relatedThreads: { file1: { loading: false, data: [] }, other: { loading: false } },
  previewMarkdown: false,
})

const branches = [
  'fileData',
  'fileRenders',
  'fileMeta',
  'fileAssemblyParts',
  'fileAssemblyParents',
  'pathToId',
  'downloadProgress',
  'relatedThreads',
]

/** Every top-level branch except `changed` keeps its reference */
const expectOtherBranchesKept = (next: any, prev: any, changed: string[]) => {
  branches.filter((branch) => !changed.includes(branch)).forEach((branch) => expect(next[branch]).toBe(prev[branch]))
}

describe('Files reducer', () => {
  const prev = makeState()

  it('hydrates a persisted state with the initial keys', () => {
    const next = reducer({ previewMarkdown: true } as any, { type: 'OTHER' })
    expect(next).toMatchObject({ previewMarkdown: true, fileData: {}, relatedThreads: {}, hydrated: true })
  })

  it('FILES/GET_FILE_PENDING sets loading', () => {
    const next = reducer(prev, { type: 'FILES/GET_FILE_PENDING', meta: { cacheKey: 'file1-rev1' } })
    expect(next.fileData['file1-rev1']).toEqual({ loading: true, data: 'solid cube' })
    expect(next.fileData.other).toBe(prev.fileData.other)
    expectOtherBranchesKept(next, prev, ['fileData'])
  })

  it('FILES/GET_FILE_REJECTED stores the error', () => {
    const next = reducer(prev, {
      type: 'FILES/GET_FILE_REJECTED',
      meta: { cacheKey: 'file1-rev1' },
      payload: { data: 'Not found' },
    })
    expect(next.fileData['file1-rev1']).toEqual({ error: 'Not found', loading: false })
    expectOtherBranchesKept(next, prev, ['fileData'])
  })

  it('FILES/GET_FILE_FULFILLED stores the data (binary data is kept as is)', () => {
    const data = new ArrayBuffer(8)
    const next = reducer(prev, {
      type: 'FILES/GET_FILE_FULFILLED',
      meta: { cacheKey: 'file2-rev1' },
      payload: { data },
    })
    expect(next.fileData['file2-rev1']).toEqual({ data, loading: false })
    expect(next.fileData['file2-rev1'].data).toBe(data)
    expect(next.fileData['file1-rev1']).toBe(prev.fileData['file1-rev1'])
    expectOtherBranchesKept(next, prev, ['fileData'])
  })

  it('FILES/GET_FILE_PROGRESS stores the percentage', () => {
    const next = reducer(prev, {
      type: 'FILES/GET_FILE_PROGRESS',
      meta: { cacheKey: 'file1-rev1' },
      payload: { percentage: 40 },
    })
    expect(next.fileData['file1-rev1']).toEqual({ loading: false, data: 'solid cube', percentage: 40 })
    expectOtherBranchesKept(next, prev, ['fileData'])
  })

  it.each(['FILES/RENDER_FILE_REJECTED', 'FILES/RENDER_FILE_DOWNLOAD_REJECTED'])(
    '%s stores the render error',
    (type) => {
      const payload = { response: { data: { error: 'Render failed' } } }
      const next = reducer(prev, { type, meta: { cacheKey: 'file1-rev1' }, payload })
      expect(next.fileRenders['file1-rev1']).toEqual({ error: 'Render failed', loading: false })
      expect(next.fileRenders.other).toBe(prev.fileRenders.other)
      expectOtherBranchesKept(next, prev, ['fileRenders'])
    },
  )

  it('FILES/RENDER_FILE_DOWNLOAD_PENDING sets loading', () => {
    const next = reducer(prev, { type: 'FILES/RENDER_FILE_DOWNLOAD_PENDING', meta: { cacheKey: 'file1-rev1' } })
    expect(next.fileRenders['file1-rev1']).toEqual({ loading: true, data: 'render' })
    expectOtherBranchesKept(next, prev, ['fileRenders'])
  })

  it('FILES/RENDER_FILE_DOWNLOAD_FULFILLED stores the render', () => {
    const next = reducer(prev, {
      type: 'FILES/RENDER_FILE_DOWNLOAD_FULFILLED',
      meta: { cacheKey: 'file1-rev1' },
      payload: { data: 'new render' },
    })
    expect(next.fileRenders['file1-rev1']).toEqual({ data: 'new render', loading: false })
    expectOtherBranchesKept(next, prev, ['fileRenders'])
  })

  it('FILES/RENDER_FILE_PROGRESS replaces the render entry with the status', () => {
    const next = reducer(prev, {
      type: 'FILES/RENDER_FILE_PROGRESS',
      meta: { cacheKey: 'file1-rev1' },
      payload: { message: 'Rendering 50%' },
    })
    expect(next.fileRenders['file1-rev1']).toEqual({ status: 'Rendering 50%' })
    expectOtherBranchesKept(next, prev, ['fileRenders'])
  })

  it.each([
    ['GET_META', 'fileMeta', 'file1-rev1', 'cacheKey'],
    ['GET_ASSEMBLY_PARTS', 'fileAssemblyParts', 'file1', 'cacheKey'],
    ['GET_ASSEMBLY_PARENTS', 'fileAssemblyParents', 'file1', 'cacheKey'],
    ['GET_RELATED_THREADS', 'relatedThreads', 'file1', 'fileId'],
    ['GET_META_FROM_PATH', 'pathToId', 'project1/cad/cube.step', 'cacheKey'],
  ])('FILES/%s_PENDING and _REJECTED toggle loading in %s', (base, branch, key, metaKey) => {
    const pending = reducer(prev, { type: `FILES/${base}_PENDING`, meta: { [metaKey]: key } })
    expect(pending[branch][key]).toEqual({ ...prev[branch][key], loading: true })
    expect(pending[branch][key].data).toBe(prev[branch][key].data)
    expect(pending[branch].other).toBe(prev[branch].other)
    expectOtherBranchesKept(pending, prev, [branch])
    const rejected = reducer(pending, { type: `FILES/${base}_REJECTED`, meta: { [metaKey]: key } })
    expect(rejected[branch][key].loading).toBe(false)
    expect(reducer(prev, { type: `FILES/${base}_REJECTED`, meta: { [metaKey]: key } })).toBe(prev)
  })

  it.each([
    ['GET_META', 'fileMeta', 'cacheKey'],
    ['GET_ASSEMBLY_PARTS', 'fileAssemblyParts', 'cacheKey'],
    ['GET_ASSEMBLY_PARENTS', 'fileAssemblyParents', 'cacheKey'],
    ['GET_RELATED_THREADS', 'relatedThreads', 'fileId'],
  ])('FILES/%s_FULFILLED stores the data in %s', (base, branch, metaKey) => {
    const data = [{ _id: 'x1' }]
    const next = reducer(prev, { type: `FILES/${base}_FULFILLED`, meta: { [metaKey]: 'file2' }, payload: { data } })
    expect(next[branch].file2).toEqual({ data, loading: false })
    expect(next[branch].other).toBe(prev[branch].other)
    expectOtherBranchesKept(next, prev, [branch])
  })

  it('FILES/GET_META_FROM_PATH_FULFILLED stores the id and the meta', () => {
    const data = { fileId: 'file3', name: 'gear.step', path: 'cad/gear.step' }
    const next = reducer(prev, {
      type: 'FILES/GET_META_FROM_PATH_FULFILLED',
      meta: { cacheKey: 'project1/cad/gear.step' },
      payload: { data },
    })
    expect(next.pathToId['project1/cad/gear.step']).toEqual({ data: 'file3', loading: false })
    expect(next.fileMeta['project1/cad/gear.step']).toEqual({ data, loading: false })
    expect(next.fileMeta['file1-rev1']).toBe(prev.fileMeta['file1-rev1'])
    expectOtherBranchesKept(next, prev, ['pathToId', 'fileMeta'])
  })

  it('FILES/DOWNLOAD_PROGRESS stores the progress', () => {
    const next = reducer(prev, { type: 'FILES/DOWNLOAD_PROGRESS', payload: { cacheKey: 'file1', progress: 75 } })
    expect(next.downloadProgress).toEqual({ file1: 75 })
    expectOtherBranchesKept(next, prev, ['downloadProgress'])
    expect(reducer(prev, { type: 'FILES/DOWNLOAD_PROGRESS', payload: { cacheKey: 'file1', progress: 10 } })).toBe(prev)
  })

  it('FILES/TOGGLE_PREVIEW_MARKDOWN toggles the preview', () => {
    const next = reducer(prev, { type: 'FILES/TOGGLE_PREVIEW_MARKDOWN' })
    expect(next.previewMarkdown).toBe(true)
    expectOtherBranchesKept(next, prev, [])
    expect(reducer(next, { type: 'FILES/TOGGLE_PREVIEW_MARKDOWN' }).previewMarkdown).toBe(false)
  })

  it('returns the same state for unknown actions', () => {
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
