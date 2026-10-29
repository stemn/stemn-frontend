import { describe, expect, it } from 'vitest'
import reducer from './Upload.reducer'

describe('Upload reducer', () => {
  const prev: any = {
    avatar: { loading: true, files: [{ preview: 'blob:1' }], percentage: 10 },
    banner: { loading: false },
  }

  it('UPLOAD/PROGRESS stores the percentage', () => {
    const next = reducer(prev, { type: 'UPLOAD/PROGRESS', meta: { cacheKey: 'avatar' }, payload: { percentage: 55 } })
    expect(next.avatar).toEqual({ ...prev.avatar, percentage: 55 })
    expect(next.avatar.files).toBe(prev.avatar.files)
    expect(next.banner).toBe(prev.banner)
  })

  it('UPLOAD/RESET clears the entry', () => {
    const next = reducer(prev, { type: 'UPLOAD/RESET', meta: { cacheKey: 'avatar' } })
    expect(next.avatar).toEqual({})
    expect(next.banner).toBe(prev.banner)
  })

  it('UPLOAD/UPLOAD_PENDING stores the file previews', () => {
    const files = [
      { preview: 'blob:2', name: 'a.png', size: 10 },
      { preview: 'blob:3', name: 'b.png', size: 20 },
    ]
    const next = reducer(prev, { type: 'UPLOAD/UPLOAD_PENDING', meta: { cacheKey: 'banner', files } })
    expect(next.banner).toEqual({ files: [{ preview: 'blob:2' }, { preview: 'blob:3' }], loading: true })
    expect(next.avatar).toBe(prev.avatar)
  })

  it('UPLOAD/UPLOAD_REJECTED replaces the entry', () => {
    const next = reducer(prev, { type: 'UPLOAD/UPLOAD_REJECTED', meta: { cacheKey: 'avatar' } })
    expect(next.avatar).toEqual({ loading: false })
    expect(next.banner).toBe(prev.banner)
  })

  it('UPLOAD/UPLOAD_FULFILLED clears loading and keeps the files', () => {
    const next = reducer(prev, { type: 'UPLOAD/UPLOAD_FULFILLED', meta: { cacheKey: 'avatar' } })
    expect(next.avatar).toEqual({ ...prev.avatar, loading: false })
    expect(next.avatar.files).toBe(prev.avatar.files)
    expect(next.banner).toBe(prev.banner)
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'UPLOAD/UPLOAD_FULFILLED', meta: { cacheKey: 'banner' } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})
