import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Mesh, MeshStandardMaterial } from 'three'
import { describe, expect, it } from 'vitest'
import { parseModel } from './PreviewCadOss.model'
import { LABEL_KEY, nodesFromScene, partsFromScene } from './PreviewCadOss.utils'

// one triangle, in the glb's binary chunk
const positions = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0])
const primitive = (material?: number) => ({
  attributes: { POSITION: 0 },
  ...(material === undefined ? {} : { material }),
})

// what the converter writes: an assembly node, an uncoloured part, and two instances of a coloured part whose mesh
// has two primitives sharing one material
const gltf = {
  asset: { version: '2.0' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [
    { name: 'bracket assembly', children: [1, 2, 3], extras: { stemn: { id: 'bracket-assembly', kind: 'assembly' } } },
    { name: 'base-plate', mesh: 0, extras: { stemn: { id: 'bracket-assembly/base-plate', kind: 'part' } } },
    { name: 'bolt', mesh: 1, extras: { stemn: { id: 'bracket-assembly/bolt', kind: 'part' } } },
    { name: 'bolt', mesh: 1, extras: { stemn: { id: 'bracket-assembly/bolt#2', kind: 'part' } } },
  ],
  meshes: [{ primitives: [primitive()] }, { primitives: [primitive(0), primitive(0)] }],
  materials: [{ pbrMetallicRoughness: { baseColorFactor: [0.2, 0.2, 0.2, 1] } }],
  accessors: [{ bufferView: 0, componentType: 5126, count: 3, type: 'VEC3', min: [0, 0, 0], max: [1, 1, 0] }],
  bufferViews: [{ buffer: 0, byteLength: positions.byteLength }],
  buffers: [{ byteLength: positions.byteLength }],
}

/** A glb (header, json chunk, binary chunk) of a glTF json and its binary buffer */
const toGlb = (json: object, binary: ArrayBufferView): ArrayBuffer => {
  const pad = (data: Buffer, fill: number) => Buffer.concat([data, Buffer.alloc((4 - (data.length % 4)) % 4, fill)])
  const jsonChunk = pad(Buffer.from(JSON.stringify(json)), 0x20)
  const binChunk = pad(Buffer.from(binary.buffer, binary.byteOffset, binary.byteLength), 0)
  const header = (length: number, type: string) => {
    const chunk = Buffer.alloc(8)
    chunk.writeUInt32LE(length, 0)
    chunk.write(type, 4, 'latin1')
    return chunk
  }
  const body = Buffer.concat([header(jsonChunk.length, 'JSON'), jsonChunk, header(binChunk.length, 'BIN\0'), binChunk])
  const start = Buffer.alloc(12)
  start.write('glTF', 0, 'latin1')
  start.writeUInt32LE(2, 4)
  start.writeUInt32LE(12 + body.length, 8)
  const glb = Buffer.concat([start, body])
  return glb.buffer.slice(glb.byteOffset, glb.byteOffset + glb.byteLength)
}

const glb = toGlb(gltf, positions)

/** A converter glb from __fixtures__ (copies of stemn-backend converter outputs) */
const parseFixture = (name: string) => {
  const file = readFileSync(join(__dirname, '__fixtures__', name))
  return parseModel(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength))
}

const meshesOf = (object: any): Mesh[] => {
  const meshes: Mesh[] = []
  object.traverse((child: any) => child.isMesh && meshes.push(child))
  return meshes
}

describe('parseModel', () => {
  it('keeps the converter ids and the glTF names as labels', async () => {
    const root = await parseModel(glb)
    const nodesById = nodesFromScene(root)
    expect([...nodesById.keys()]).toEqual([
      'bracket-assembly',
      'bracket-assembly/base-plate',
      'bracket-assembly/bolt',
      'bracket-assembly/bolt#2',
    ])
    expect(nodesById.get('bracket-assembly')!.userData[LABEL_KEY]).toBe('bracket assembly')
    expect(partsFromScene(root, nodesById).map(({ id, name }) => [id, name])).toEqual([
      ['bracket-assembly/base-plate', 'base-plate'],
      ['bracket-assembly/bolt', 'bolt'],
      ['bracket-assembly/bolt#2', 'bolt'],
    ])
  })

  it('gives every mesh its own material, so one node can be recoloured alone', async () => {
    const root = await parseModel(glb)
    const materials = meshesOf(root).map((mesh) => mesh.material as MeshStandardMaterial)
    expect(materials).toHaveLength(5)
    expect(new Set(materials).size).toBe(5)
    // uncoloured parts take the palette, coloured parts keep their colour
    const nodesById = nodesFromScene(root)
    const plate = meshesOf(nodesById.get('bracket-assembly/base-plate'))[0].material as MeshStandardMaterial
    const bolt = meshesOf(nodesById.get('bracket-assembly/bolt#2'))[0].material as MeshStandardMaterial
    expect(plate.color.getHexString()).toBe('b8bdc7')
    expect(bolt.color.r).toBeCloseTo(0.2)
  })

  it('reads the ids and labels of the converter assembly', async () => {
    const root = await parseFixture('assembly.glb')
    const nodesById = nodesFromScene(root)
    expect([...nodesById.keys()]).toEqual([
      'bracket-assembly',
      'bracket-assembly/base-plate',
      'bracket-assembly/bracket',
    ])
    expect([...nodesById.values()].map((object) => object.userData[LABEL_KEY])).toEqual([
      'bracket-assembly',
      'base-plate',
      'bracket',
    ])
    expect(nodesById.get('bracket-assembly/bracket')!.userData.stemn).toMatchObject({ kind: 'part' })
    expect(partsFromScene(root, nodesById).map(({ id, name }) => [id, name])).toEqual([
      ['bracket-assembly/base-plate', 'base-plate'],
      ['bracket-assembly/bracket', 'bracket'],
    ])
  })

  it('reads the five parts of the bracket assembly revision used by the diff fixtures', async () => {
    const root = await parseFixture('bracket-assembly-v1.glb')
    const nodesById = nodesFromScene(root)
    expect([...nodesById.keys()]).toEqual([
      'bracket-assembly',
      'bracket-assembly/base-plate',
      'bracket-assembly/bracket',
      'bracket-assembly/pin',
      'bracket-assembly/spacer',
      'bracket-assembly/nut',
    ])
    expect(partsFromScene(root, nodesById).map((part) => part.name)).toEqual([
      'base-plate',
      'bracket',
      'pin',
      'spacer',
      'nut',
    ])
    // every part has its own material
    const materials = new Set(meshesOf(root).map((mesh) => mesh.material))
    expect(materials.size).toBe(meshesOf(root).length)
  })

  it('reads glbs written before the converter added ids, with label path ids', async () => {
    const root = await parseFixture('assembly-without-ids.glb')
    expect([...nodesFromScene(root).keys()]).toEqual([
      'bracket-assembly',
      'bracket-assembly/base-plate',
      'bracket-assembly/bracket',
    ])
    expect(partsFromScene(root).map((item) => [item.name, item.triangles])).toEqual([
      ['base-plate', 604],
      ['bracket', 944],
    ])
  })
})
