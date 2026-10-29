import { describe, expect, it } from 'vitest'
import reducer from './CodeSplitting.reducer'

describe('CodeSplitting reducer', () => {
  const prev = {
    codemirror: { loading: false, loaded: true },
    pdfjs: { loading: false },
  }

  it.each([
    ['CODE_SPLITTING/LOAD_PENDING', { loading: true }],
    ['CODE_SPLITTING/LOADING', { loading: true }],
    ['CODE_SPLITTING/LOAD_REJECTED', { loading: false }],
    ['CODE_SPLITTING/COMPLETE', { loading: false }],
    ['CODE_SPLITTING/LOAD_FULFILLED', { loading: false, loaded: true }],
  ])('%s updates the module entry', (type, expected) => {
    const loading = { ...prev, pdfjs: { loading: !expected.loading } }
    const next = reducer(loading, { type, meta: { cacheKey: 'pdfjs' } })
    expect(next.pdfjs).toEqual(expected)
    expect(next.codemirror).toBe(prev.codemirror)
  })

  it('creates the entry for a new module', () => {
    const next = reducer({}, { type: 'CODE_SPLITTING/LOAD_PENDING', meta: { cacheKey: 'katex' } })
    expect(next).toEqual({ katex: { loading: true } })
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'CODE_SPLITTING/LOAD_FULFILLED', meta: { cacheKey: 'codemirror' } })).toBe(prev)
    expect(reducer(prev, { type: 'CODE_SPLITTING/COMPLETE', meta: { cacheKey: 'pdfjs' } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
