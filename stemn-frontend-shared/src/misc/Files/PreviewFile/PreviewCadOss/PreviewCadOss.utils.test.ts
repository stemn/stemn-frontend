import { BoxGeometry, Box3, BufferGeometry, Group, Mesh, Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import {
  fitCamera,
  isOpenCascadeRender,
  LABEL_KEY,
  NODE_FLAG,
  nodesFromScene,
  PART_FLAG,
  paletteColour,
  partPalette,
  partsFromScene,
  renderModelUrl,
  sectionPlane,
  viewDirection,
} from './PreviewCadOss.utils'

const part = (label: string, extras?: object, geometry: BufferGeometry = new BoxGeometry(1, 1, 1)) => {
  const mesh = new Mesh(geometry)
  mesh.name = label
  mesh.userData[NODE_FLAG] = true
  mesh.userData[PART_FLAG] = true
  mesh.userData[LABEL_KEY] = label
  if (extras) mesh.userData.stemn = extras
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

const node = (label: string, extras?: object) => {
  const group = new Group()
  group.name = label.replace(/[^\w-]/g, '_')
  group.userData[NODE_FLAG] = true
  group.userData[LABEL_KEY] = label
  if (extras) group.userData.stemn = extras
  return group
}

describe('nodesFromScene', () => {
  it('maps nodes by the converter ids in extras.stemn', () => {
    const root = new Group()
    const assembly = node('bracket-assembly', { id: 'bracket-assembly', kind: 'assembly' })
    const plate = node('base-plate', { id: 'bracket-assembly/base-plate', kind: 'part' })
    const bolts = [1, 2].map((n) =>
      node('bolt', { id: n === 1 ? 'bracket-assembly/bolt' : 'bracket-assembly/bolt#2', kind: 'part' }),
    )
    assembly.add(plate, ...bolts)
    root.add(assembly)
    const nodesById = nodesFromScene(root)
    expect([...nodesById.keys()]).toEqual([
      'bracket-assembly',
      'bracket-assembly/base-plate',
      'bracket-assembly/bolt',
      'bracket-assembly/bolt#2',
    ])
    expect(nodesById.get('bracket-assembly/bolt#2')).toBe(bolts[1])
  })

  it('falls back to label paths, numbering repeated siblings like the converter', () => {
    // a glb from before the converter wrote ids; three's names are unique and sanitised, labels are not
    const root = new Group()
    const assembly = node('bracket assembly')
    const bolts = [node('bolt'), node('bolt'), node('bolt')]
    assembly.add(node('base-plate'), ...bolts)
    root.add(assembly)
    expect([...nodesFromScene(root).keys()]).toEqual([
      'bracket assembly',
      'bracket assembly/base-plate',
      'bracket assembly/bolt',
      'bracket assembly/bolt#2',
      'bracket assembly/bolt#3',
    ])
  })

  it('skips the objects three adds that are not glTF nodes', () => {
    // a multi-primitive node is a group of plain meshes
    const root = new Group()
    const wrapper = new Group()
    const housing = node('housing', { id: 'housing', kind: 'part' })
    housing.add(new Mesh(new BoxGeometry()), new Mesh(new BoxGeometry()))
    wrapper.add(housing)
    root.add(wrapper)
    expect([...nodesFromScene(root).entries()]).toEqual([['housing', housing]])
  })
})

describe('partsFromScene', () => {
  it('lists the nodes with geometry in scene order, keyed by id and named by label', () => {
    // the converter's assembly: a root node with two mesh nodes
    const root = new Group()
    const assembly = node('bracket-assembly', { id: 'bracket-assembly', kind: 'assembly' })
    assembly.add(
      part('base-plate', { id: 'bracket-assembly/base-plate' }),
      part('bracket', { id: 'bracket-assembly/bracket' }),
    )
    root.add(assembly)
    expect(partsFromScene(root)).toEqual([
      { id: 'bracket-assembly/base-plate', name: 'base-plate', triangles: 12 },
      { id: 'bracket-assembly/bracket', name: 'bracket', triangles: 12 },
    ])
  })

  it('counts a multi-primitive node once, with the triangles of all its meshes', () => {
    const housing = node('housing', { id: 'housing', kind: 'part' })
    housing.userData[PART_FLAG] = true
    housing.add(new Mesh(new BoxGeometry(1, 1, 1)), new Mesh(new BoxGeometry(1, 1, 1)))
    const root = new Group()
    root.add(housing)
    expect(partsFromScene(root)).toEqual([{ id: 'housing', name: 'housing', triangles: 24 }])
  })

  it('names unlabelled parts by position', () => {
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
