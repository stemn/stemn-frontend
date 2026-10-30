import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  compareLayers,
  featureColours,
  featuresOf,
  isToolpathFile,
  layerHeights,
  layerStats,
  parseToolpath,
  ToolpathFormatError,
} from './toolpath'

// the converter's toolpaths of the backend's tube samples (stemn-backend core/__tests__/samples/additive): v2 removes
// the layer at 1.0 mm, moves the one at 0.8 mm 1.5 mm in x, adds solid infill at 1.4 mm and a layer at 2.2 mm
const fixture = (name: string) => {
  const data = readFileSync(join(__dirname, '__fixtures__', name))
  return parseToolpath(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength))
}

const v1 = fixture('tube-v1.toolpath.bin')
const v2 = fixture('tube-v2.toolpath.bin')

const layer = (toolpath: typeof v1, id: string) => toolpath.layers.find((candidate) => candidate.id === id)!

describe('parseToolpath', () => {
  it('reads the header and the arrays in place', () => {
    expect(v1).toMatchObject({ version: 1, units: 'mm', slicer: 'prusaslicer', milling: false })
    expect(v1.layers).toHaveLength(10)
    expect(v1.layers[0]).toMatchObject({ id: 'layer:z+0.000', z: 0.2, height: 0.2, point: 0, segment: 0 })
    expect(v1.kinds).toHaveLength(v1.segments)
    expect(v1.speeds).toHaveLength(v1.segments)
    expect(v1.points).toHaveLength((v1.segments + v1.layers.length) * 2)

    // every layer's points follow the one before
    v1.layers.slice(1).forEach((current, index) => {
      const previous = v1.layers[index]
      expect(current.point).toBe(previous.point + previous.count + 1)
      expect(current.segment).toBe(previous.segment + previous.count)
    })

    // the second layer starts with the travel to its outer wall at (92, 90.225), at 30 mm/s
    const second = v1.layers[1]
    expect(v1.kinds[second.segment]).toBe(0)
    expect([...v1.points.slice((second.point + 1) * 2, (second.point + 1) * 2 + 2)]).toEqual([
      92,
      expect.closeTo(90.225),
    ])
    expect(v1.features[v1.kinds[second.segment + 1] - 1]).toBe('outer-wall')
    expect(v1.speeds[second.segment + 1]).toBe(30)
  })

  it('refuses files that are not toolpaths', () => {
    expect(() => parseToolpath(new TextEncoder().encode('glTF....').buffer)).toThrow(ToolpathFormatError)
  })
})

describe('the layers of a toolpath', () => {
  it('lists the features a layer extrudes, each with a colour', () => {
    expect(featuresOf(v1, [v1.layers[0]])).toEqual(['custom', 'outer-wall', 'inner-wall', 'skirt'])
    expect(featuresOf(v2, [layer(v2, 'layer:z+1.200')])).toEqual(['outer-wall', 'inner-wall', 'solid-infill'])
    featuresOf(v2).forEach((feature) => expect(featureColours[feature]).toMatch(/^#[0-9a-f]{6}$/))
  })

  it('measures a layer: the two walls of the tube are 149.7 mm long', () => {
    const stats = layerStats(v1, v1.layers[1])
    expect(stats.extrusions).toBe(44)
    expect(stats.length).toBeCloseTo(149.74, 1)
  })

  it('puts the heights of both revisions on one slider', () => {
    expect(layerHeights(v1, v2)).toEqual([0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2])
    expect(layerHeights(v1, null)).toHaveLength(10)
  })

  it('opens G-code files', () => {
    expect(['print.gcode', 'PRINT.GCO', 'part.g', 'pocket.nc'].every(isToolpathFile)).toBe(true)
    expect(isToolpathFile('part.step')).toBe(false)
    expect(isToolpathFile(undefined)).toBe(false)
  })
})

describe('compareLayers', () => {
  it('finds the extrusions only B has in a modified layer', () => {
    const a = { toolpath: v1, layer: layer(v1, 'layer:z+1.200') }
    const b = { toolpath: v2, layer: layer(v2, 'layer:z+1.200') }
    const comparison = compareLayers(a, b)

    // the solid infill: six passes and five steps between them, all new; the walls are where they were
    expect(comparison.aOnly).toEqual([])
    expect(comparison.bOnly).toHaveLength(11)
    expect(comparison.shared).toHaveLength(44)
    comparison.bOnly.forEach((index) => expect(v2.features[v2.kinds[b.layer.segment + index] - 1]).toBe('solid-infill'))
  })

  it('a layer moved in x shares nothing with where it was', () => {
    const comparison = compareLayers(
      { toolpath: v1, layer: layer(v1, 'layer:z+0.600') },
      { toolpath: v2, layer: layer(v2, 'layer:z+0.600') },
    )
    expect(comparison.shared.length).toBeLessThan(10)
    expect(comparison.aOnly.length).toBeGreaterThan(30)
    expect(comparison.bOnly.length).toBeGreaterThan(30)
  })

  it('an unchanged layer is all shared, whichever way its lines were drawn', () => {
    const same = compareLayers(
      { toolpath: v1, layer: layer(v1, 'layer:z+0.200') },
      { toolpath: v2, layer: layer(v2, 'layer:z+0.200') },
    )
    expect(same).toEqual({ aOnly: [], bOnly: [], shared: expect.any(Array) })
    expect(same.shared).toHaveLength(44)
  })
})
