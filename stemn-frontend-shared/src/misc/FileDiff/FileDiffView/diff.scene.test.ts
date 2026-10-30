import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Color, Matrix4, type Mesh, type MeshStandardMaterial, type Object3D, Quaternion, Vector3 } from 'three'
import { beforeAll, describe, expect, it } from 'vitest'
import { parseModel } from '../../Files/PreviewFile/PreviewCadOss/PreviewCadOss.model'
import { nodesFromScene } from '../../Files/PreviewFile/PreviewCadOss/PreviewCadOss.utils'
import manifestFixture from '../__fixtures__/bracket-assembly.diff.json'
import type { IDiffManifest } from '../diff.types'
import { diffColours, ghostOpacity, initialViewState, removedOpacity, unifiedAppearance } from '../diff.utils'
import {
  applyAppearance,
  displacementLine,
  entityNode,
  type IDiffModel,
  idsByNode,
  interpolatePlacement,
  pickedEntity,
  placeAlongMove,
  rememberPlacements,
  setOutline,
  visibleBounds,
} from './diff.scene'

// the converter's glbs of bracket-assembly-v1.step and -v2.step, and the backend's manifest of their diff
const fixture = (path: string) => {
  const data = readFileSync(join(__dirname, path))
  return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer
}
const manifest = manifestFixture as unknown as IDiffManifest
const entity = (id: string) => manifest.entities.find((candidate) => candidate.id === `bracket-assembly/${id}`)!

let a: IDiffModel
let b: IDiffModel

const load = async (path: string) => {
  const root = await parseModel(fixture(path))
  const model = { root, nodesById: nodesFromScene(root) }
  rememberPlacements(model)
  return model
}

const material = (node: Object3D | null) => {
  let found: MeshStandardMaterial | null = null
  node?.traverse((object) => {
    if (!found && (object as Mesh).isMesh) found = (object as Mesh).material as MeshStandardMaterial
  })
  return found as unknown as MeshStandardMaterial
}

const worldPosition = (node: Object3D) => new Vector3().setFromMatrixPosition(node.matrixWorld)

beforeAll(async () => {
  a = await load('../../Files/PreviewFile/PreviewCadOss/__fixtures__/bracket-assembly-v1.glb')
  b = await load('../__fixtures__/bracket-assembly-v2.glb')
})

describe('the unified view on the bracket assembly', () => {
  const draw = (state = initialViewState()) =>
    manifest.entities.forEach((record) => {
      const appearance = unifiedAppearance(record, state)
      const nodeA = entityNode(a, record, 'a')
      const nodeB = entityNode(b, record, 'b')
      applyAppearance(nodeA, appearance.a)
      applyAppearance(nodeB, appearance.b)
      placeAlongMove(nodeA, nodeB, appearance.b && appearance.b.placement !== undefined ? appearance.b.placement : 1)
    })

  it('finds every entity of the manifest in its revision glb by its stable id', () => {
    manifest.entities.forEach((record) => {
      if (record.idA) expect(entityNode(a, record, 'a'), record.idA).not.toBeNull()
      if (record.idB) expect(entityNode(b, record, 'b'), record.idB).not.toBeNull()
    })
  })

  it('colours and ghosts each class', () => {
    draw()
    const colour = (hex: string) => new Color(hex).getHex()

    // added: B solid green
    expect(material(entityNode(b, entity('washer'), 'b')).color.getHex()).toBe(colour(diffColours.added))
    expect(material(entityNode(b, entity('washer'), 'b')).transparent).toBe(false)

    // removed: A red, 30%, transparent, not writing depth, drawn late
    const pin = entityNode(a, entity('pin'), 'a')!
    expect(pin.visible).toBe(true)
    expect(material(pin)).toMatchObject({ opacity: removedOpacity, transparent: true, depthWrite: false })
    expect(material(pin).color.getHex()).toBe(colour(diffColours.removed))

    // modified: B solid amber, A ghosted
    expect(material(entityNode(b, entity('base-plate'), 'b'))).toMatchObject({ opacity: 1, transparent: false })
    expect(material(entityNode(a, entity('base-plate'), 'a'))).toMatchObject({
      opacity: ghostOpacity,
      transparent: true,
    })

    // unchanged: only B, neutral
    expect(entityNode(a, entity('nut'), 'a')!.visible).toBe(false)
    expect(material(entityNode(b, entity('nut'), 'b')).color.getHex()).toBe(colour(diffColours.unchanged))
  })

  it('moves B of a moved entity along the slider, from A placement to its own', () => {
    const spacerA = entityNode(a, entity('spacer'), 'a')!
    const spacerB = entityNode(b, entity('spacer'), 'b')!
    const start = worldPosition(spacerA)
    const end = new Vector3().setFromMatrixPosition(spacerB.userData.diffWorld)

    // 60 mm along x between the revisions
    expect(end.x - start.x).toBeCloseTo(-0.06)

    draw({ ...initialViewState(), blend: 0 })
    expect(worldPosition(spacerB).distanceTo(start)).toBeLessThan(1e-9)

    draw({ ...initialViewState(), blend: 0.5 })
    expect(worldPosition(spacerB).x).toBeCloseTo((start.x + end.x) / 2)

    draw()
    expect(worldPosition(spacerB).distanceTo(end)).toBeLessThan(1e-9)
  })

  it('draws the displacement line between the A and B centres', () => {
    const line = displacementLine(entity('spacer'), diffColours.moved)!
    const positions = line.geometry.getAttribute('position')
    expect(positions.getX(1) - positions.getX(0)).toBeCloseTo(-0.06)
    expect(displacementLine({ ...entity('spacer'), centreA: null }, diffColours.moved)).toBeNull()
  })

  it('picks the entity of a clicked mesh, and fits to what is visible', () => {
    const plate = entityNode(b, entity('base-plate'), 'b')!
    let mesh: Object3D | null = null
    plate.traverse((object) => {
      if (!mesh && (object as Mesh).isMesh) mesh = object
    })
    const sides = [
      { side: 'a' as const, ids: idsByNode(a) },
      { side: 'b' as const, ids: idsByNode(b) },
    ]
    expect(pickedEntity(mesh, sides)).toEqual({ id: 'bracket-assembly/base-plate', side: 'b' })
    expect(pickedEntity(b.root, sides)).toBeNull()

    const box = visibleBounds([plate])
    expect(box.max.x - box.min.x).toBeCloseTo(0.1)
  })

  it('outlines a node and removes the outline again', () => {
    const nut = entityNode(b, entity('nut'), 'b')!
    setOutline(nut, '#000000')
    const outlines: Object3D[] = []
    nut.traverse((object) => object.userData && object.type === 'LineSegments' && outlines.push(object))
    expect(outlines.length).toBeGreaterThan(0)
    setOutline(nut, null)
    expect(outlines.every((outline) => !outline.visible)).toBe(true)
  })
})

it('interpolates placements: positions linearly, rotations by slerp', () => {
  const from = new Matrix4().makeTranslation(0, 0, 0)
  const to = new Matrix4().compose(
    new Vector3(2, 0, 0),
    new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2),
    new Vector3(1, 1, 1),
  )
  const half = interpolatePlacement(from, to, 0.5)
  const [position, rotation] = [new Vector3(), new Quaternion()]
  half.decompose(position, rotation, new Vector3())
  expect(position.x).toBeCloseTo(1)
  expect(2 * Math.acos(rotation.w)).toBeCloseTo(Math.PI / 4)
})
