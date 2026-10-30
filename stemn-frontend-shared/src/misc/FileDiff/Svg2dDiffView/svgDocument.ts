/**
 * The DOM side of the 2D (SVG) diff viewers: parsing a revision's SVG safely, finding an entity's elements
 * (`data-entity-id`, the manifest's payloadRef.svg), its layers (`data-layer`), and drawing an entity with a class
 * appearance (diff.utils): the class colour over every painted fill and stroke, opacity on the entity, and B's copy of a
 * moved entity placed along the slider. Converters write their SVGs to this shape (stemn-frontend docs/DIFF-VIEWERS.md):
 *   <svg viewBox data-units> [<rect data-background fill>] (the canvas colour, drawn once behind both revisions)
 *     <g data-diff-frame> (the frame the manifest's centres are in)
 *     <g data-layer="WALLS" data-layer-name="Walls" [data-off="true" | data-layer-default="hidden"]> (back to front)
 *       <g data-entity-id="2F" [data-paint="fill|stroke|both"]> shapes </g>
 */
import type { IDiffAppearance } from '../diff.utils'
import { parseViewBox } from './svg2d.utils'

export const svgNamespace = 'http://www.w3.org/2000/svg'

/** What may never run from a converted drawing: scripts, embedded HTML, event handlers, javascript: links */
export const sanitizeSvg = (root: Element) => {
  root.querySelectorAll('script, foreignObject, iframe, object, embed').forEach((element) => element.remove())
  ;[root, ...Array.from(root.querySelectorAll('*'))].forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase()
      const isLink = name === 'href' || name === 'xlink:href'
      if (name.startsWith('on') || (isLink && /^\s*javascript:/i.test(attribute.value))) {
        element.removeAttribute(attribute.name)
      }
    })
  })
  return root
}

/** A revision's SVG text as a sanitised <svg> element (not attached to the page) */
export const parseSvg = (text: string): SVGSVGElement => {
  const parsed = new DOMParser().parseFromString(text, 'image/svg+xml')
  const root = parsed.documentElement
  if (!root || root.nodeName.toLowerCase() !== 'svg' || parsed.getElementsByTagName('parsererror').length) {
    throw new Error('The drawing could not be read.')
  }
  return sanitizeSvg(root) as unknown as SVGSVGElement
}

/** Downloads a revision's SVG with the user's token and parses it (sanitised) */
export const fetchDrawing = async (url: string, token?: string | null, signal?: AbortSignal) => {
  const response = await fetch(url, { headers: token ? { Authorization: `bearer ${token}` } : {}, signal })
  if (!response.ok) throw new Error(`The drawing could not be downloaded (${response.status}).`)
  return parseSvg(await response.text())
}

export const svgViewBox = (root: Element | null | undefined) =>
  root ? parseViewBox(root.getAttribute('viewBox')) : null

/** Every element that draws an entity (an entity may span layers: a footprint's pads and silkscreen) */
export const entityElements = (root: Element | null | undefined, id: string | null | undefined): Element[] =>
  root && id ? Array.from(root.querySelectorAll(`[data-entity-id="${CSS.escape(id)}"]`)) : []

export interface ISvgLayer {
  id: string
  name: string
  /** Off when the drawing has the layer turned off or frozen */
  off: boolean
}

/** The layers of the drawings, back to front, each once */
export const svgLayers = (roots: Array<Element | null | undefined>): ISvgLayer[] => {
  const layers = new Map<string, ISvgLayer>()
  roots.forEach((root) => {
    if (!root) return
    root.querySelectorAll('[data-layer]').forEach((element) => {
      const id = element.getAttribute('data-layer') || ''
      if (!layers.has(id)) {
        layers.set(id, {
          id,
          name: element.getAttribute('data-layer-name') || id,
          off: element.getAttribute('data-off') === 'true' || element.getAttribute('data-layer-default') === 'hidden',
        })
      }
    })
  })
  return [...layers.values()]
}

/** The layers a drawing starts with hidden: the ones it has turned off or frozen */
export const initiallyHidden = (layers: ISvgLayer[]) =>
  new Set(layers.filter((layer) => layer.off).map((layer) => layer.id))

export const toggled = (hidden: Set<string>, id: string) => {
  const next = new Set(hidden)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

/** Shows or hides layers in a drawing */
export const applyLayers = (root: Element | null | undefined, hiddenLayers: Set<string>) => {
  if (!root) return
  root.querySelectorAll('[data-layer]').forEach((element) => {
    ;(element as SVGElement).style.display = hiddenLayers.has(element.getAttribute('data-layer') || '') ? 'none' : ''
  })
}

const shapeSelector = 'path, rect, circle, ellipse, line, polyline, polygon, text, use'

const painted = (value: string | null) => value !== null && value !== 'none'

/** The paint a shape takes the class colour on: what data-paint above it says, or the paints it has of its own */
const paintsOf = (shape: Element, entity: Element) => {
  const marked = (shape.closest('[data-paint]') as Element | null) || null
  const paint = marked && entity.contains(marked) ? marked.getAttribute('data-paint') : null
  if (paint) return { fill: paint === 'fill' || paint === 'both', stroke: paint === 'stroke' || paint === 'both' }
  return { fill: painted(shape.getAttribute('fill')), stroke: painted(shape.getAttribute('stroke')) }
}

/**
 * Draws an entity's elements with an appearance: hidden for null, otherwise the class colour on every painted fill and
 * stroke (and as `color`, for currentColor) and the opacity on the entity's element, so overlapping shapes of one
 * entity do not add up. `transform` goes in front of the element's own transform (a moved entity along the slider).
 */
export const applySvgAppearance = (elements: Element[], appearance: IDiffAppearance | null, transform = '') => {
  elements.forEach((element) => {
    const style = (element as SVGElement).style
    if (!appearance) {
      style.display = 'none'
      return
    }
    style.display = ''
    style.opacity = appearance.opacity >= 1 ? '' : String(appearance.opacity)
    // currentColor: the entity's, and any colour its groups set (a block's entities) below it
    ;[element, ...Array.from(element.querySelectorAll('[color]'))].forEach((colouring) => {
      ;(colouring as SVGElement).style.color = appearance.colour
    })
    ;[element, ...Array.from(element.querySelectorAll(shapeSelector))].forEach((shape) => {
      if (!shape.matches(shapeSelector)) return
      const paints = paintsOf(shape, element)
      const shapeStyle = (shape as SVGElement).style
      shapeStyle.fill = paints.fill ? appearance.colour : ''
      shapeStyle.stroke = paints.stroke ? appearance.colour : ''
    })
    if (!element.hasAttribute('data-diff-transform')) {
      element.setAttribute('data-diff-transform', element.getAttribute('transform') || '')
    }
    const own = element.getAttribute('data-diff-transform') || ''
    const placed = [transform, own].filter(Boolean).join(' ')
    if (placed) element.setAttribute('transform', placed)
    else element.removeAttribute('transform')
  })
}

/** The element the manifest's centres are in: the drawing's data-diff-frame group, or the <svg> itself */
export const diffFrame = (root: Element) => root.querySelector('[data-diff-frame]') || root

/** The drawing's background colour (its data-background shape's fill), or null */
export const svgBackground = (root: Element | null | undefined) => {
  const background = root ? root.querySelector('[data-background]') : null
  return background ? background.getAttribute('fill') : null
}

/** A thin line between two points of the drawing's frame, the same width at every zoom */
export const displacementLine = (from: number[], to: number[], colour: string) => {
  const line = document.createElementNS(svgNamespace, 'line')
  line.setAttribute('x1', String(from[0]))
  line.setAttribute('y1', String(from[1]))
  line.setAttribute('x2', String(to[0]))
  line.setAttribute('y2', String(to[1]))
  line.setAttribute('stroke', colour)
  line.setAttribute('stroke-width', '1.5')
  line.setAttribute('stroke-dasharray', '4 3')
  line.setAttribute('vector-effect', 'non-scaling-stroke')
  line.setAttribute('data-diff-line', 'true')
  line.style.pointerEvents = 'none'
  return line
}

/** The entity id and the revision ('a' or 'b') of the element under the pointer */
export const pickedEntity = (target: EventTarget | null) => {
  const element = target instanceof Element ? target.closest('[data-entity-id]') : null
  const side = element ? element.closest('[data-diff-side]') : null
  return element && side
    ? { id: element.getAttribute('data-entity-id') || '', side: side.getAttribute('data-diff-side') as 'a' | 'b' }
    : null
}
