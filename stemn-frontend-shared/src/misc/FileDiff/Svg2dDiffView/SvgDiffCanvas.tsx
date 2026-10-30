/**
 * The canvas of the 2D diff viewers: revision A's and B's SVG drawings overlaid in one <svg> (unified view), or one of
 * them (a pane of the side-by-side view, or a plain preview), each entity drawn with its class appearance. Pan by
 * dragging, zoom with the wheel; the view box is the caller's, so two panes can share it.
 */
import * as React from 'react'
import type { IDiffEntity } from '../diff.types'
import { diffColours, type IDiffAppearance } from '../diff.utils'
import classes from './Svg2dDiffView.module.scss'
import {
  type IViewBox,
  fitViewBox,
  formatViewBox,
  panViewBox,
  placementTransform,
  rectToViewBox,
  toViewBox,
  unionViewBox,
  viewTransform,
  zoomViewBox,
} from './svg2d.utils'
import {
  applyLayers,
  applySvgAppearance,
  diffFrame,
  displacementLine,
  entityElements,
  pickedEntity,
  svgBackground,
  svgViewBox,
} from './svgDocument'

export type ISvgAppearanceFor = (entity: IDiffEntity) => {
  a: IDiffAppearance | null
  b: IDiffAppearance | null
  line?: boolean
}

export interface ISvgDiffCanvasProps {
  /** Revision A's drawing (unified view, or the left pane); copied into this canvas */
  drawingA?: SVGSVGElement | null
  /** Revision B's drawing (unified view, the right pane, or a preview) */
  drawingB?: SVGSVGElement | null
  entities: IDiffEntity[]
  /** The class appearance of each entity; without it the drawing keeps its own colours (a preview) */
  appearanceFor?: ISvgAppearanceFor
  selected: string | null
  hovered: string | null
  onPick: (id: string | null) => void
  onHover: (id: string | null) => void
  /** Bumped to fit the view to the selection (or everything) */
  fitRequest: number
  viewBox: IViewBox | null
  onViewBox: (viewBox: IViewBox) => void
  /** Only the primary pane fits the view, the other shares its view box */
  primary?: boolean
  hiddenLayers: Set<string>
  label: string
  testId: string
}

type ISides = { a: Element | null; b: Element | null }

/** Presentation attributes of a drawing's <svg> that its contents inherit, kept on the group that replaces it */
const inheritedAttributes = ['fill', 'stroke', 'stroke-width', 'color', 'font-family', 'font-size', 'style']

const copyInto = (drawing: SVGSVGElement, side: 'a' | 'b') => {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  group.setAttribute('data-diff-side', side)
  inheritedAttributes.forEach((name) => {
    const value = drawing.getAttribute(name)
    if (value) group.setAttribute(name, value)
  })
  const copy = document.importNode(drawing, true)
  // the background is the canvas's colour, so one revision's never covers the other's
  copy.querySelectorAll('[data-background]').forEach((background) => background.remove())
  while (copy.firstChild) group.appendChild(copy.firstChild)
  return group
}

/** Picks within a few pixels of the pointer too, as most of a drawing is thin lines */
const pickNear = (event: { clientX: number; clientY: number; target: EventTarget | null }) => {
  const direct = pickedEntity(event.target)
  if (direct || typeof document.elementsFromPoint !== 'function') return direct
  for (const [dx, dy] of [
    [-3, 0],
    [3, 0],
    [0, -3],
    [0, 3],
    [-3, -3],
    [3, 3],
    [-3, 3],
    [3, -3],
  ]) {
    for (const element of document.elementsFromPoint(event.clientX + dx, event.clientY + dy)) {
      const picked = pickedEntity(element)
      if (picked) return picked
    }
  }
  return null
}

export const SvgDiffCanvas = ({
  drawingA,
  drawingB,
  entities,
  appearanceFor,
  selected,
  hovered,
  onPick,
  onHover,
  fitRequest,
  viewBox,
  onViewBox,
  primary = true,
  hiddenLayers,
  label,
  testId,
}: ISvgDiffCanvasProps) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null)
  const sidesRef = React.useRef<ISides>({ a: null, b: null })
  const [contents, setContents] = React.useState(0)
  const viewBoxRef = React.useRef(viewBox)
  viewBoxRef.current = viewBox
  const drawn = unionViewBox([svgViewBox(drawingA), svgViewBox(drawingB)])
  const background = svgBackground(drawingB) || svgBackground(drawingA)

  // the drawings' contents in this canvas: B first, A over it (ghosts are drawn after what is solid)
  React.useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const sides: ISides = { a: null, b: null }
    if (drawingB) sides.b = svg.appendChild(copyInto(drawingB, 'b'))
    if (drawingA) sides.a = svg.appendChild(copyInto(drawingA, 'a'))
    sidesRef.current = sides
    setContents((value) => value + 1)
    return () => {
      ;[sides.a, sides.b].forEach((side) => side && side.remove())
      sidesRef.current = { a: null, b: null }
    }
  }, [drawingA, drawingB])

  const elementsOf = React.useCallback((entity: IDiffEntity | undefined) => {
    const { a, b } = sidesRef.current
    if (!entity) return []
    return [
      ...entityElements(a, (entity.payloadRefA && entity.payloadRefA.svg) || entity.idA),
      ...entityElements(b, (entity.payloadRefB && entity.payloadRefB.svg) || entity.idB),
    ]
  }, [])

  // the class appearances, B's placement along the slider, and the displacement lines
  React.useEffect(() => {
    const { a, b } = sidesRef.current
    if (!appearanceFor) return
    const lines: Element[] = []
    entities.forEach((entity) => {
      const appearance = appearanceFor(entity)
      const refA = entity.payloadRefA || {}
      const refB = entity.payloadRefB || {}
      if (a) applySvgAppearance(entityElements(a, refA.svg || entity.idA), appearance.a)
      if (b) {
        const placement = appearance.b ? appearance.b.placement : undefined
        const transform =
          placement === undefined
            ? ''
            : placementTransform({
                t: placement,
                centreA: entity.centreA,
                centreB: entity.centreB,
                atA: refA.at,
                atB: refB.at,
              })
        applySvgAppearance(entityElements(b, refB.svg || entity.idB), appearance.b, transform)
      }
      if (appearance.line && a && b && entity.centreA && entity.centreB) {
        lines.push(
          diffFrame(b).appendChild(displacementLine(entity.centreA, entity.centreB, diffColours[entity.class])),
        )
      }
    })
    return () => lines.forEach((line) => line.remove())
  }, [entities, appearanceFor, contents])

  React.useEffect(() => {
    const { a, b } = sidesRef.current
    applyLayers(a, hiddenLayers)
    applyLayers(b, hiddenLayers)
  }, [hiddenLayers, contents])

  // the hovered and the selected entity stand out
  React.useEffect(() => {
    const marked = [
      { id: hovered, attribute: 'data-diff-hovered' },
      { id: selected, attribute: 'data-diff-selected' },
    ].flatMap(({ id, attribute }) => {
      const elements = id ? elementsOf(entities.find((entity) => entity.id === id)) : []
      elements.forEach((element) => element.setAttribute(attribute, 'true'))
      return elements.map((element) => ({ element, attribute }))
    })
    return () => marked.forEach(({ element, attribute }) => element.removeAttribute(attribute))
  }, [hovered, selected, entities, elementsOf, contents])

  // fit the selection, or both drawings, when asked and when the drawings load: what to fit is read when the request
  // comes, not on every selection
  const fitRef = React.useRef({ selected, entities, drawn, onViewBox })
  fitRef.current = { selected, entities, drawn, onViewBox }
  React.useEffect(() => {
    const svg = svgRef.current
    const { selected: target, entities: all, drawn: whole, onViewBox: fitTo } = fitRef.current
    if (!primary || !svg || !whole) return
    const { width, height } = svg.getBoundingClientRect()
    const aspect = width > 0 && height > 0 ? width / height : 1
    const current = viewBoxRef.current || whole
    const elements = target
      ? elementsOf(all.find((entity) => entity.id === target)).filter(
          (element) => (element as SVGElement).style.display !== 'none',
        )
      : []
    const box = unionViewBox(
      elements.map((element) => {
        const rect = element.getBoundingClientRect()
        const origin = svg.getBoundingClientRect()
        if (!rect.width && !rect.height) return null
        return rectToViewBox(current, width, height, {
          left: rect.left - origin.left,
          top: rect.top - origin.top,
          right: rect.right - origin.left,
          bottom: rect.bottom - origin.top,
        })
      }),
    )
    fitTo(fitViewBox(box || whole, aspect, box ? 2.5 : 1.05))
  }, [fitRequest, contents, primary, elementsOf])

  // zoom about the pointer with the wheel (a listener of our own: React's wheel listeners cannot prevent scrolling)
  React.useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const onWheel = (event: WheelEvent) => {
      const current = viewBoxRef.current
      if (!current) return
      event.preventDefault()
      const rect = svg.getBoundingClientRect()
      const point = toViewBox(current, rect.width, rect.height, {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
      onViewBox(zoomViewBox(current, Math.exp(-event.deltaY * 0.0015), point))
    }
    svg.addEventListener('wheel', onWheel, { passive: false })
    return () => svg.removeEventListener('wheel', onWheel)
  }, [onViewBox])

  const dragRef = React.useRef<{ x: number; y: number; box: IViewBox; moved: boolean } | null>(null)

  const entityOf = (picked: { id: string; side: 'a' | 'b' } | null) =>
    picked ? entities.find((entity) => (picked.side === 'a' ? entity.idA : entity.idB) === picked.id) : undefined

  const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!viewBox || event.button !== 0) return
    dragRef.current = { x: event.clientX, y: event.clientY, box: viewBox, moved: false }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const start = dragRef.current
    if (start) {
      const dx = event.clientX - start.x
      const dy = event.clientY - start.y
      if (Math.abs(dx) + Math.abs(dy) > 4) start.moved = true
      if (start.moved) {
        const rect = event.currentTarget.getBoundingClientRect()
        const { scale } = viewTransform(start.box, rect.width, rect.height)
        onViewBox(panViewBox(start.box, -dx / scale, -dy / scale))
      }
      return
    }
    const entity = entityOf(pickNear(event))
    onHover(entity ? entity.id : null)
  }

  const onPointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
    const start = dragRef.current
    dragRef.current = null
    if (start && start.moved) return
    const entity = entityOf(pickNear(event))
    onPick(entity ? entity.id : null)
  }

  return (
    <div
      className={`${classes.canvas} flex rel-box`}
      data-testid={testId}
      style={background ? { background } : undefined}
    >
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox ? formatViewBox(viewBox) : drawn ? formatViewBox(drawn) : undefined}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => !dragRef.current && onHover(null)}
      />
    </div>
  )
}
