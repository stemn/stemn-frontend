/**
 * The arithmetic of the 2D (SVG) diff viewers, without the DOM: view boxes (union, fit to a viewport, zoom about a point,
 * client to view box coordinates) and the placement of a moved entity along the A -> B slider. Unit-tested on its own.
 */

/** An SVG view box, in user units: x and y of the top left corner, width and height */
export interface IViewBox {
  x: number
  y: number
  width: number
  height: number
}

export const parseViewBox = (value: string | null | undefined): IViewBox | null => {
  if (!value) return null
  const numbers = value
    .trim()
    .split(/[\s,]+/)
    .map(Number)
  if (numbers.length !== 4 || numbers.some((number) => !Number.isFinite(number))) return null
  const [x, y, width, height] = numbers
  return width > 0 && height > 0 ? { x, y, width, height } : null
}

export const formatViewBox = (box: IViewBox) => `${box.x} ${box.y} ${box.width} ${box.height}`

/** The smallest view box around all the given ones (null when none is given) */
export const unionViewBox = (boxes: Array<IViewBox | null | undefined>): IViewBox | null => {
  const present = boxes.filter((box): box is IViewBox => Boolean(box))
  if (!present.length) return null
  const left = Math.min(...present.map((box) => box.x))
  const top = Math.min(...present.map((box) => box.y))
  const right = Math.max(...present.map((box) => box.x + box.width))
  const bottom = Math.max(...present.map((box) => box.y + box.height))
  return { x: left, y: top, width: right - left, height: bottom - top }
}

/**
 * A view box showing `box` with a margin (1.1 = 10% wider) and the viewport's aspect ratio (width / height), centred,
 * so zooming and panning work in the same units as the screen. Boxes without size (a point) get a minimum one.
 */
export const fitViewBox = (box: IViewBox, aspect: number, margin = 1.1, minimum = 1e-3): IViewBox => {
  const width = Math.max(box.width, minimum) * margin
  const height = Math.max(box.height, minimum) * margin
  const ratio = aspect > 0 && Number.isFinite(aspect) ? aspect : 1
  const [fittedWidth, fittedHeight] = width / height > ratio ? [width, width / ratio] : [height * ratio, height]
  const centreX = box.x + box.width / 2
  const centreY = box.y + box.height / 2
  return { x: centreX - fittedWidth / 2, y: centreY - fittedHeight / 2, width: fittedWidth, height: fittedHeight }
}

/** Zooms by `factor` (above 1 zooms in) keeping the point (in view box units) where it is on screen */
export const zoomViewBox = (box: IViewBox, factor: number, point: { x: number; y: number }): IViewBox => {
  const width = box.width / factor
  const height = box.height / factor
  return {
    x: point.x - ((point.x - box.x) / box.width) * width,
    y: point.y - ((point.y - box.y) / box.height) * height,
    width,
    height,
  }
}

/** Moves the view box by an amount in its own units */
export const panViewBox = (box: IViewBox, dx: number, dy: number): IViewBox => ({
  ...box,
  x: box.x + dx,
  y: box.y + dy,
})

/**
 * How an <svg> element of the given client size shows a view box (preserveAspectRatio xMidYMid meet): the scale from
 * user units to pixels and the offset of the view box's corner inside the element
 */
export const viewTransform = (box: IViewBox, width: number, height: number) => {
  const scale = Math.min(width / box.width, height / box.height) || 1
  return {
    scale,
    offsetX: (width - box.width * scale) / 2,
    offsetY: (height - box.height * scale) / 2,
  }
}

/** A point of the element (pixels from its top left corner) in view box units */
export const toViewBox = (box: IViewBox, width: number, height: number, point: { x: number; y: number }) => {
  const { scale, offsetX, offsetY } = viewTransform(box, width, height)
  return { x: box.x + (point.x - offsetX) / scale, y: box.y + (point.y - offsetY) / scale }
}

/** A rectangle of the element (pixels) in view box units */
export const rectToViewBox = (
  box: IViewBox,
  width: number,
  height: number,
  rect: { left: number; top: number; right: number; bottom: number },
): IViewBox => {
  const topLeft = toViewBox(box, width, height, { x: rect.left, y: rect.top })
  const bottomRight = toViewBox(box, width, height, { x: rect.right, y: rect.bottom })
  return { x: topLeft.x, y: topLeft.y, width: bottomRight.x - topLeft.x, height: bottomRight.y - topLeft.y }
}

const lerp = (from: number, to: number, t: number) => from + (to - from) * t

const number = (value: number) => String(Number(value.toFixed(6)) + 0)

/** The signed difference from angle `from` to angle `to` in degrees, the short way round (-180 to 180) */
export const angleBetween = (from: number, to: number) => ((((to - from) % 360) + 540) % 360) - 180

/**
 * The transform that draws B's copy of a moved entity t of the way from A's placement to its own (t = 1: where it is,
 * t = 0: at A's placement), to put in front of the element's own transform. With placements (`at`: [x, y, degrees] in
 * the element's parent's user units, in SVG's rotate() sense) on both sides it turns about the placement origin as well;
 * otherwise it moves by the difference of the centres (the manifest's centreA and centreB, in the same units).
 */
export const placementTransform = ({
  t,
  centreA,
  centreB,
  atA,
  atB,
}: {
  t: number
  centreA?: number[] | null
  centreB?: number[] | null
  atA?: number[] | null
  atB?: number[] | null
}) => {
  if (t >= 1) return ''
  if (atA && atB && atA.length >= 3 && atB.length >= 3) {
    const x = lerp(atA[0], atB[0], t)
    const y = lerp(atA[1], atB[1], t)
    const turn = -angleBetween(atA[2], atB[2]) * (1 - t)
    return `translate(${number(x)} ${number(y)}) rotate(${number(turn)}) translate(${number(-atB[0])} ${number(-atB[1])})`
  }
  if (centreA && centreB) {
    const dx = (centreA[0] - centreB[0]) * (1 - t)
    const dy = (centreA[1] - centreB[1]) * (1 - t)
    return `translate(${number(dx)} ${number(dy)})`
  }
  return ''
}
