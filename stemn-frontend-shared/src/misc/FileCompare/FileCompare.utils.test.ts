// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { initCompare } from './FileCompare.actions'
import { getCompareModes, isCadFile } from './FileCompare.utils.js'

const revision = (name: string, revisionId: string) => ({ data: { name, provider: 'stemn', revisionId } })

describe('compare modes for CAD files', () => {
  it('offers the unified diff first for CAD files, and not for others', () => {
    expect(getCompareModes('autodesk', 'autodesk').map((mode) => mode.value)).toEqual([
      'unified',
      'sideBySide',
      'aboveAndBelow',
      'onion',
      'slider',
      'single',
    ])
    expect(getCompareModes('image', 'image').map((mode) => mode.value)).not.toContain('unified')
  })

  it('knows CAD files by extension, whichever provider converts them', () => {
    expect(isCadFile({ name: 'bracket.step', provider: 'stemn' })).toBe(true)
    expect(isCadFile({ name: 'bracket.SLDPRT', provider: 'dropbox' })).toBe(true)
    expect(isCadFile({ name: 'notes.md', provider: 'stemn' })).toBe(false)
    expect(isCadFile(undefined)).toBe(false)
  })

  it('opens two revisions of a CAD file in the unified diff, other files side by side', () => {
    const cad = {
      data: { name: 'bracket.step', provider: 'stemn' },
      revisions: [revision('bracket.step', 'b'), revision('bracket.step', 'a')],
    }
    const text = {
      data: { name: 'notes.md', provider: 'stemn' },
      revisions: [revision('notes.md', 'b'), revision('notes.md', 'a')],
    }
    expect(initCompare({ file: cad as any, cacheKey: 'cad' }).payload.mode).toBe('unified')
    expect(initCompare({ file: text as any, cacheKey: 'text' }).payload.mode).toBe('sideBySide')
    expect(initCompare({ file: { data: cad.data, revisions: [] } as any, cacheKey: 'one' }).payload.mode).toBe('single')
  })
})
