import { describe, expect, it } from 'vitest'
import {
  angleBetween,
  fitViewBox,
  formatViewBox,
  panViewBox,
  parseViewBox,
  placementTransform,
  rectToViewBox,
  toViewBox,
  unionViewBox,
  zoomViewBox,
} from './svg2d.utils'

describe('view boxes', () => {
  it('parses and formats them, and rejects what is not one', () => {
    expect(parseViewBox('-212 -8212 11024 8424')).toEqual({ x: -212, y: -8212, width: 11024, height: 8424 })
    expect(parseViewBox('0,0,10,5')).toEqual({ x: 0, y: 0, width: 10, height: 5 })
    expect(parseViewBox('0 0 0 5')).toBeNull()
    expect(parseViewBox('0 0 10')).toBeNull()
    expect(parseViewBox(null)).toBeNull()
    expect(formatViewBox({ x: 1, y: 2, width: 3, height: 4 })).toBe('1 2 3 4')
  })

  it('unites the drawings of both revisions', () => {
    expect(unionViewBox([{ x: 0, y: 0, width: 10, height: 10 }, null, { x: -5, y: 5, width: 10, height: 10 }])).toEqual(
      { x: -5, y: 0, width: 15, height: 15 },
    )
    expect(unionViewBox([null, undefined])).toBeNull()
  })

  it('fits a box to the viewport with a margin, centred', () => {
    // a wide viewport around a square: the height decides, the width follows the viewport
    expect(fitViewBox({ x: 0, y: 0, width: 10, height: 10 }, 2, 1)).toEqual({ x: -5, y: 0, width: 20, height: 10 })
    expect(fitViewBox({ x: 0, y: 0, width: 10, height: 10 }, 0.5, 1.2)).toEqual({ x: -1, y: -7, width: 12, height: 24 })
    // a point still gets a view
    expect(fitViewBox({ x: 3, y: 3, width: 0, height: 0 }, 1, 1, 2)).toEqual({ x: 2, y: 2, width: 2, height: 2 })
  })

  it('zooms about a point that stays where it is', () => {
    const box = { x: 0, y: 0, width: 100, height: 50 }
    const zoomed = zoomViewBox(box, 2, { x: 25, y: 25 })
    expect(zoomed).toEqual({ x: 12.5, y: 12.5, width: 50, height: 25 })
    // the point is as far across the zoomed box as across the old one
    expect((25 - zoomed.x) / zoomed.width).toBe((25 - box.x) / box.width)
    expect(panViewBox(zoomed, -2.5, 5)).toEqual({ x: 10, y: 17.5, width: 50, height: 25 })
  })

  it('maps element pixels to view box units, letterboxed (xMidYMid meet)', () => {
    // a 100 x 50 box in a 400 x 400 element: 4 px per unit, 100 px bands above and below
    const box = { x: 0, y: 0, width: 100, height: 50 }
    expect(toViewBox(box, 400, 400, { x: 0, y: 100 })).toEqual({ x: 0, y: 0 })
    expect(toViewBox(box, 400, 400, { x: 400, y: 300 })).toEqual({ x: 100, y: 50 })
    expect(rectToViewBox(box, 400, 400, { left: 40, top: 140, right: 80, bottom: 180 })).toEqual({
      x: 10,
      y: 10,
      width: 10,
      height: 10,
    })
  })
})

describe('the A -> B slider for moved entities', () => {
  it('moves by the difference of the centres when there are no placements', () => {
    const move = { centreA: [2450, 4450, 0], centreB: [2950, 4450, 0] }
    expect(placementTransform({ ...move, t: 1 })).toBe('')
    expect(placementTransform({ ...move, t: 0 })).toBe('translate(-500 0)')
    expect(placementTransform({ ...move, t: 0.5 })).toBe('translate(-250 0)')
    expect(placementTransform({ t: 0, centreA: null, centreB: [1, 2] })).toBe('')
  })

  it('turns about the placement origin the short way round with placements on both sides', () => {
    expect(angleBetween(350, 10)).toBe(20)
    expect(angleBetween(10, 350)).toBe(-20)
    // b at (10, 0) turned 90°, a at (0, 0) unturned: at t = 0 b is drawn at a's placement
    expect(placementTransform({ t: 0, atA: [0, 0, 0], atB: [10, 0, 90] })).toBe(
      'translate(0 0) rotate(-90) translate(-10 0)',
    )
    expect(placementTransform({ t: 0.5, atA: [0, 0, 0], atB: [10, 0, 90] })).toBe(
      'translate(5 0) rotate(-45) translate(-10 0)',
    )
  })
})
