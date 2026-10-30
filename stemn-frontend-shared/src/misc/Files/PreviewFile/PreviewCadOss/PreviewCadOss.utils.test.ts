import { BoxGeometry, Box3, BufferGeometry, Group, Mesh, Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import {
  fitCamera,
  isOpenCascadeRender,
  PART_FLAG,
  paletteColour,
  partPalette,
  partsFromScene,
  renderModelUrl,
  sectionPlane,
  viewDirection,
} from './PreviewCadOss.utils'

const part = (name: string, geometry: BufferGeometry = new BoxGeometry(1, 1, 1)) => {
  const mesh = new Mesh(geometry)
  mesh.name = name
  mesh.userData[PART_FLAG] = true
  return mesh
}

describe('isOpenCascadeRender', () => {
  it('picks the open-source viewer only for opencascade renders', () => {
    expect(isOpenCascadeRender({ cadProvider: 'opencascade' })).toBe(true)
    expect(isOpenCascadeRender({ cadProvider: 'autodesk' })).toBe(false)
    // renders from before the provider was recorded are Autodesk renders
    expect(isOpenCascadeRender({})).toBe(false)
    expect(isOpenCascadeRender(undefined)).toBe(false)
  })
})

describe('partsFromScene', () => {
  it('lists the flagged glTF nodes of an assembly in scene order with their triangles', () => {
    // the converter's assembly: a root node with two mesh nodes
    const root = new Group()
    root.name = 'bracket-assembly'
    root.add(part('base-plate'), part('bracket'))
    const parts = partsFromScene(root)
    expect(parts.map(({ name, triangles }) => ({ name, triangles }))).toEqual([
      { name: 'base-plate', triangles: 12 },
      { name: 'bracket', triangles: 12 },
    ])
  })

  it('counts a multi-primitive node once, with the triangles of all its meshes', () => {
    const node = new Group()
    node.name = 'housing'
    node.userData[PART_FLAG] = true
    node.add(new Mesh(new BoxGeometry(1, 1, 1)), new Mesh(new BoxGeometry(1, 1, 1)))
    expect(partsFromScene(node)).toMatchObject([{ name: 'housing', triangles: 24 }])
  })

  it('names unnamed parts by position', () => {
    const root = new Group()
    root.add(part(''), part(''))
    expect(partsFromScene(root).map((item) => item.name)).toEqual(['Part 1', 'Part 2'])
  })
})

describe('palette', () => {
  it('matches the converter thumbnails and wraps around', () => {
    expect(partPalette).toHaveLength(6)
    expect(paletteColour(0)).toEqual([0.72, 0.74, 0.78])
    expect(paletteColour(1)).toEqual([0.42, 0.58, 0.78])
    expect(paletteColour(6)).toEqual(paletteColour(0))
  })
})

describe('fitCamera', () => {
  const box = new Box3(new Vector3(-0.05, 0, -0.02), new Vector3(0.05, 0.035, 0.02))

  it('looks at the centre of the model from the isometric direction', () => {
    const fit = fitCamera(box, 45, 1)
    expect(fit.target.toArray()).toEqual([0, 0.0175, 0])
    const direction = fit.position.clone().sub(fit.target).normalize()
    expect(direction.distanceTo(viewDirection)).toBeLessThan(1e-9)
  })

  it('keeps the whole bounding sphere in view, also in narrow viewports', () => {
    for (const aspect of [0.4, 1, 2.5]) {
      const fit = fitCamera(box, 45, aspect)
      const distance = fit.position.distanceTo(fit.target)
      const vertical = (45 * Math.PI) / 180
      const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * aspect)
      // the sphere's angular radius fits inside half of the narrower field of view
      expect(Math.asin(fit.radius / distance)).toBeLessThanOrEqual(Math.min(vertical, horizontal) / 2)
      expect(fit.near).toBeGreaterThan(0)
      expect(fit.near).toBeLessThan(distance - fit.radius)
      expect(fit.far).toBeGreaterThan(distance + fit.radius)
    }
  })
})

describe('sectionPlane', () => {
  const box = new Box3(new Vector3(0, 0, 0), new Vector3(10, 20, 30))

  it('cuts across the axis at the fraction and keeps the part below the cut', () => {
    const plane = sectionPlane(box, 'y', 0.25)
    expect(plane.distanceToPoint(new Vector3(5, 4, 5))).toBeGreaterThan(0)
    expect(plane.distanceToPoint(new Vector3(5, 6, 5))).toBeLessThan(0)
  })

  it('clamps the fraction to the model', () => {
    expect(sectionPlane(box, 'x', 2).distanceToPoint(new Vector3(10, 0, 0))).toBeCloseTo(0)
    expect(sectionPlane(box, 'z', -1).distanceToPoint(new Vector3(0, 0, 0))).toBeCloseTo(0)
  })
})

describe('renderModelUrl', () => {
  it('is the render download route of the API', () => {
    expect(renderModelUrl({ projectId: 'p', fileId: 'f', revisionId: 'r' })).toBe(
      'http://localhost:3000/api/v1/sync/downloadRender/p/f/r',
    )
  })
})
