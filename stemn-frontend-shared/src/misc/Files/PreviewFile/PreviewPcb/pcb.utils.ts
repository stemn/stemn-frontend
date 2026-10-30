/**
 * PCB and electronics files and the drawings the API's PCB converter makes of them (stemn-backend
 * services/pcb-converter): a layered SVG in millimetres with a `<rect data-background>`, one `<g data-layer>` per layer
 * back to front (mask, paste, fab and courtyard layers `data-layer-default="hidden"`) and one `<g data-entity-id>` per
 * entity in each layer it is drawn on. The 2D diff viewer's svgDocument reads them; this file only knows what is PCB
 * specific. No React and no three.js: the preview registry and FileCompare (main bundle) use it.
 */

/** What the API's PCB converter reads (stemn-backend core/pcb/isSupported.ts): KiCad, Eagle, Gerber, Excellon, zips */
export const pcbExtensions = [
  'kicad_pcb',
  'kicad_sch',
  'brd',
  'gbr',
  'ger',
  'pho',
  'art',
  'gtl',
  'gbl',
  'gts',
  'gbs',
  'gto',
  'gbo',
  'gtp',
  'gbp',
  'gko',
  'gm1',
  'gml',
  'drl',
  'xln',
  'exc',
  'drd',
  'zip',
  // Protel's inner copper layers
  ...Array.from({ length: 30 }, (_, index) => `g${index + 1}`),
]

/** One output of a PCB render: the drawing (the default) or the scene model */
export const pcbOutputUrl = (
  { projectId, fileId, revisionId }: { projectId: string; fileId: string; revisionId: string },
  output: 'drawing.svg' | 'scene.json' = 'drawing.svg',
) => `${GLOBAL_ENV.API_SERVER}/api/v1/sync/downloadRenderFile/${projectId}/${fileId}/${revisionId}/${output}`

const extensionOf = (name?: string) => (name && name.includes('.') ? name.split('.').pop()!.toLowerCase() : '')

export const isPcbExtension = (extension = '') => pcbExtensions.includes(extension.toLowerCase())

export const isPcbFile = (file?: { name?: string } | null) => isPcbExtension(extensionOf(file?.name))

/** What the preview's status line calls a drawing, by the converter's `data-format` */
export const formatNames: Record<string, string> = {
  kicad_pcb: 'KiCad board',
  eagle_brd: 'Eagle board',
  kicad_sch: 'KiCad schematic',
  gerber: 'Gerber',
  excellon: 'Excellon drill',
  'gerber-zip': 'Gerber set',
  'gerber-assembly': 'Gerber layers',
}

/** Back to front, like the converter: the back's documentation, copper from the back up, the front, outline, holes */
export const layerRank = (layer: string) => {
  const [side, kind = ''] = layer.split('.')
  const documentation = ['Fab', 'Adhesive', 'Paste', 'Silkscreen', 'Mask']
  if (layer === 'B.Cu') return 100
  if (/^In\d+$/.test(side) && kind === 'Cu') return 200 - Number(side.slice(2))
  if (layer === 'F.Cu') return 300
  if (side === 'B' && documentation.includes(kind)) return documentation.indexOf(kind)
  if (side === 'F' && documentation.includes(kind)) return 400 - documentation.indexOf(kind)
  if (layer.startsWith('Drill')) return 700
  return layer === 'Edge.Cuts' ? 500 : 600
}

const numbersOf = (svg: Element) =>
  (svg.getAttribute('viewBox') || '')
    .trim()
    .split(/[\s,]+/)
    .map(Number)

/**
 * A folder's Gerber files shown as one board (the API's Gerber assemblies): each part's drawing has its own layer, and
 * they are drawn together in one SVG, back to front, over the first drawing's background
 */
export const combineDrawings = (drawings: SVGSVGElement[]): SVGSVGElement => {
  if (drawings.length === 1) return drawings[0]
  const boxes = drawings.map(numbersOf).filter((box) => box.length === 4 && box.every(Number.isFinite))
  const left = Math.min(...boxes.map(([x]) => x))
  const top = Math.min(...boxes.map(([, y]) => y))
  const right = Math.max(...boxes.map(([x, , width]) => x + width))
  const bottom = Math.max(...boxes.map(([, y, , height]) => y + height))
  const svg = drawings[0].cloneNode(false) as SVGSVGElement
  svg.setAttribute('viewBox', `${left} ${top} ${right - left} ${bottom - top}`)
  svg.setAttribute('data-format', 'gerber-assembly')
  const background = drawings[0].querySelector(':scope > [data-background]')
  if (background) svg.appendChild(background.cloneNode(false))
  drawings
    .flatMap((drawing) => Array.from(drawing.children).filter((child) => child.hasAttribute('data-layer')))
    .sort((a, b) => layerRank(a.getAttribute('data-layer') || '') - layerRank(b.getAttribute('data-layer') || ''))
    .forEach((layer) => svg.appendChild(layer.cloneNode(true)))
  return svg
}
