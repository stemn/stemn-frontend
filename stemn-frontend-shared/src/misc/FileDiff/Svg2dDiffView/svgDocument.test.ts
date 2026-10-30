// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import manifestFixture from '../__fixtures__/plan.diff.json'
import type { IDiffManifest } from '../diff.types'
import { diffColours, ghostOpacity, initialViewState, removedOpacity, unifiedAppearance } from '../diff.utils'
import {
  applyLayers,
  applySvgAppearance,
  diffFrame,
  entityElements,
  parseSvg,
  pickedEntity,
  sanitizeSvg,
  svgBackground,
  svgLayers,
  svgViewBox,
} from './svgDocument'

// the converter's SVGs of the floor plan in two revisions, and the API's manifest of their diff
const fixture = (name: string) => readFileSync(join(__dirname, '..', '__fixtures__', name)).toString()
const manifest = manifestFixture as unknown as IDiffManifest
const entity = (kind: string, diffClass: string) =>
  manifest.entities.find((candidate) => candidate.kind === kind && candidate.class === diffClass)!

let a: SVGSVGElement
let b: SVGSVGElement

beforeAll(() => {
  // jsdom has no CSS.escape
  if (!globalThis.CSS) (globalThis as any).CSS = { escape: (value: string) => value.replace(/["\\]/g, '\\$&') }
  a = parseSvg(fixture('plan-v1.svg'))
  b = parseSvg(fixture('plan-v2.svg'))
})

describe('reading a revision drawing', () => {
  it('finds every entity of the manifest by its payloadRef, and the layers back to front', () => {
    manifest.entities.forEach((record) => {
      if (record.payloadRefA) expect(entityElements(a, record.payloadRefA.svg)).toHaveLength(1)
      if (record.payloadRefB) expect(entityElements(b, record.payloadRefB.svg)).toHaveLength(1)
    })
    expect(svgLayers([b, a]).map((layer) => layer.id)).toEqual(['WALLS', 'DOORS', 'FURNITURE'])
    expect(svgViewBox(b)).toEqual({ x: -212, y: -8212, width: 11024, height: 8424 })
    expect(diffFrame(b).getAttribute('transform')).toBe('scale(1 -1)')
  })

  it("reads a board's background and the layers that start hidden", () => {
    const board = parseSvg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect data-background="true" fill="#001023"/>' +
        '<g data-layer="F.Cu" data-layer-name="Front copper"/><g data-layer="F.Paste" data-layer-default="hidden"/></svg>',
    )
    expect(svgBackground(board)).toBe('#001023')
    expect(svgBackground(b)).toBeNull()
    expect(svgLayers([board])).toEqual([
      { id: 'F.Cu', name: 'Front copper', off: false },
      { id: 'F.Paste', name: 'F.Paste', off: true },
    ])
  })

  it('removes anything that could run', () => {
    const root = parseSvg(
      '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(2)</script>' +
        '<a href="javascript:alert(3)"><path d="M0 0" onclick="alert(4)"/></a><foreignObject/></svg>',
    )
    expect(root.querySelector('script')).toBeNull()
    expect(root.querySelector('foreignObject')).toBeNull()
    expect(root.getAttribute('onload')).toBeNull()
    expect(root.querySelector('path')!.getAttribute('onclick')).toBeNull()
    expect(root.querySelector('a')!.getAttribute('href')).toBeNull()
    expect(sanitizeSvg(root)).toBe(root)
    expect(() => parseSvg('<html/>')).toThrow('The drawing could not be read.')
  })

  it('picks the entity and revision under the pointer', () => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    group.setAttribute('data-diff-side', 'b')
    group.appendChild(document.importNode(b, true))
    const path = group.querySelector('[data-entity-id="3A"] path')
    expect(pickedEntity(path)).toEqual({ id: '3A', side: 'b' })
    expect(pickedEntity(group)).toBeNull()
  })
})

describe('drawing entities with their class', () => {
  it('colours every shape of a removed entity in A and ghosts it', () => {
    const removed = entity('CIRCLE', 'removed')
    const appearance = unifiedAppearance(removed, initialViewState())
    const [element] = entityElements(a, removed.payloadRefA!.svg)
    applySvgAppearance([element], appearance.a)
    expect((element as SVGElement).style.opacity).toBe(String(removedOpacity))
    // the circle is drawn in currentColor: every colour below the entity takes the class colour
    element.querySelectorAll('[color]').forEach((colouring) => {
      expect((colouring as SVGElement).style.color).toBe('rgb(214, 69, 65)')
    })
    expect(diffColours.removed).toBe('#d64541')
  })

  it('places B of a moved block reference along the slider, and back', () => {
    const moved = entity('INSERT', 'moved')
    const [element] = entityElements(b, moved.payloadRefB!.svg)
    const own = element.getAttribute('transform')
    applySvgAppearance([element], unifiedAppearance(moved, initialViewState()).b, 'translate(-500 0)')
    expect(element.getAttribute('transform')).toBe(['translate(-500 0)', own].filter(Boolean).join(' '))
    applySvgAppearance([element], unifiedAppearance(moved, initialViewState()).b)
    expect(element.getAttribute('transform')).toBe(own)
  })

  it('overrides painted fills and strokes of shapes that carry their own, and hides what is not drawn', () => {
    const root = parseSvg(
      '<svg xmlns="http://www.w3.org/2000/svg"><g data-entity-id="fp:1"><rect fill="#c83434"/><path stroke="#fff" fill="none"/></g>' +
        '<g data-entity-id="fp:1" data-paint="stroke"><circle fill="red"/></g></svg>',
    )
    const elements = entityElements(root, 'fp:1')
    expect(elements).toHaveLength(2)
    applySvgAppearance(elements, { colour: '#e8a317', opacity: ghostOpacity, transparent: true, renderOrder: 1 })
    const [rect, path, circle] = Array.from(root.querySelectorAll('rect, path, circle')) as SVGElement[]
    expect([rect.style.fill, rect.style.stroke]).toEqual(['rgb(232, 163, 23)', ''])
    expect([path.style.fill, path.style.stroke]).toEqual(['', 'rgb(232, 163, 23)'])
    expect([circle.style.fill, circle.style.stroke]).toEqual(['', 'rgb(232, 163, 23)'])
    expect((elements[0] as SVGElement).style.opacity).toBe(String(ghostOpacity))
    applySvgAppearance(elements, null)
    expect((elements[0] as SVGElement).style.display).toBe('none')
  })

  it('hides and shows layers', () => {
    applyLayers(b, new Set(['FURNITURE']))
    const display = (id: string) => (b.querySelector(`[data-layer="${id}"]`) as SVGElement).style.display
    expect([display('WALLS'), display('FURNITURE')]).toEqual(['', 'none'])
    applyLayers(b, new Set())
    expect(display('FURNITURE')).toBe('')
  })
})
