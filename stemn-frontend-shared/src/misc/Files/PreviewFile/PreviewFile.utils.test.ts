import { describe, expect, it, vi } from 'vitest'
import { getViewerType, viewerFileTypes } from './PreviewFile.utils'

// codemirror needs a DOM; only its mode list is used here
vi.mock('codemirror', () => ({ modeInfo: [{ ext: ['js', 'ts'] }, { name: 'no ext' }] }))
vi.mock('codemirror/mode/meta.js', () => ({}))

describe('getViewerType', () => {
  it('uses the general viewers for every provider', () => {
    expect(getViewerType('part.step', 'stemn')).toBe('autodesk')
    expect(getViewerType('photo.PNG', 'dropbox')).toBe('image')
    expect(getViewerType('report.pdf', 'drive')).toBe('pdf')
    expect(getViewerType('index.ts', 'stemn')).toBe('code')
    expect(getViewerType('unknown.xyz', 'stemn')).toBe('other')
  })

  it('sends the CAD formats of both conversion providers to the CAD viewer', () => {
    for (const name of [
      'part.STEP',
      'part.stp',
      'part.iges',
      'part.igs',
      'part.brep',
      'part.brp',
      'part.stl',
      'part.obj',
    ]) {
      expect(getViewerType(name, 'stemn')).toBe('autodesk')
    }
    for (const name of ['mesh.ply', 'mesh.3mf', 'part.sldprt', 'assembly.iam']) {
      expect(getViewerType(name, 'stemn')).toBe('autodesk')
    }
  })

  it('adds the provider specific extensions to the general ones', () => {
    expect(getViewerType('slides.pptx', 'dropbox')).toBe('pdf')
    expect(getViewerType('slides.pptx', 'drive')).toBe('google')
    expect(getViewerType('movie.webm', 'drive')).toBe('google')
    expect(getViewerType('doc.gdoc', 'drive')).toBe('gdoc')
    expect(getViewerType('slides.pptx', 'stemn')).toBe('other')
  })

  it('does not modify the file type lists', () => {
    getViewerType('slides.pptx', 'drive')
    expect(viewerFileTypes.general.google).not.toContain('pptx')
    expect(viewerFileTypes.general.pdf).toEqual(['pdf'])
  })

  it('rejects unknown providers', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(getViewerType('part.step', 'box')).toBe('other')
    error.mockRestore()
  })
})
