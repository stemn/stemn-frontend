// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { initiallyHidden, parseSvg, svgLayers } from '../../../FileDiff/Svg2dDiffView/svgDocument'
import { combineDrawings, isPcbExtension, isPcbFile, layerRank, pcbOutputUrl } from './pcb.utils'

// drawings as the API's PCB converter writes them (stemn-backend services/pcb-converter README)
const drawing = (layers: string, viewBox = '0 0 30 20') =>
  parseSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" data-format="gerber" data-units="mm">
<rect data-background="true" x="0" y="0" width="30" height="20" fill="#001023"/>
${layers}
</svg>`)

const layer = (id: string, hidden = false) =>
  `<g data-layer="${id}" data-layer-name="${id}"${hidden ? ' data-layer-default="hidden"' : ''}>
  <g data-entity-id="${id}/cmp:R1"><path d="M0 0L1 1" fill="#c83434"/></g>
</g>`

describe('PCB files', () => {
  it('knows the formats the PCB converter reads', () => {
    for (const extension of ['kicad_pcb', 'KICAD_SCH', 'brd', 'gbr', 'gtl', 'g2', 'drl', 'zip']) {
      expect(isPcbExtension(extension)).toBe(true)
    }
    for (const extension of ['step', 'sch', 'pcbdoc', 'g31', 'gerber', ''])
      expect(isPcbExtension(extension)).toBe(false)
    expect(isPcbFile({ name: 'blinky-v2.kicad_pcb' })).toBe(true)
    expect(isPcbFile({ name: 'README' })).toBe(false)
    expect(isPcbFile(null)).toBe(false)
  })

  it('addresses a render output', () => {
    expect(pcbOutputUrl({ projectId: 'p', fileId: 'f', revisionId: 'r' })).toBe(
      'http://localhost:3000/api/v1/sync/downloadRenderFile/p/f/r/drawing.svg',
    )
    expect(pcbOutputUrl({ projectId: 'p', fileId: 'f', revisionId: 'r' }, 'scene.json')).toMatch(/\/scene\.json$/)
  })

  it('orders layers like a board seen from the front', () => {
    const layers = [
      'Drill',
      'F.Silkscreen',
      'Edge.Cuts',
      'In1.Cu',
      'B.Silkscreen',
      'F.Cu',
      'In2.Cu',
      'B.Cu',
      'Dwgs.User',
    ]

    expect([...layers].sort((a, b) => layerRank(a) - layerRank(b))).toEqual([
      'B.Silkscreen',
      'B.Cu',
      'In2.Cu',
      'In1.Cu',
      'F.Cu',
      'F.Silkscreen',
      'Edge.Cuts',
      'Dwgs.User',
      'Drill',
    ])
  })

  it("reads the converter's layers, the hidden ones off to start with", () => {
    const layers = svgLayers([drawing(`${layer('F.Mask', true)}${layer('F.Cu')}`)])

    expect(layers.map(({ id }) => id)).toEqual(['F.Mask', 'F.Cu'])
    expect([...initiallyHidden(layers)]).toEqual(['F.Mask'])
  })
})

describe('Gerber assemblies', () => {
  it("draw their files as one board, back to front, over the first one's background", () => {
    const combined = combineDrawings([
      drawing(layer('F.Silkscreen'), '0 0 10 10'),
      drawing(layer('B.Cu'), '-5 0 10 10'),
      drawing(layer('F.Cu', true), '0 0 20 30'),
    ])

    expect(svgLayers([combined]).map(({ id }) => id)).toEqual(['B.Cu', 'F.Cu', 'F.Silkscreen'])
    expect([...initiallyHidden(svgLayers([combined]))]).toEqual(['F.Cu'])
    expect(combined.getAttribute('viewBox')).toBe('-5 0 25 30')
    expect(combined.getAttribute('data-format')).toBe('gerber-assembly')
    expect(combined.querySelectorAll('[data-background]')).toHaveLength(1)
    expect(combined.querySelectorAll('[data-entity-id]')).toHaveLength(3)
  })

  it('leave a single drawing as it is', () => {
    const single = drawing(layer('F.Cu'))

    expect(combineDrawings([single])).toBe(single)
  })
})
