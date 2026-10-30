/**
 * Fetches what the simulation viewer draws, with the user's token: a revision's scene model and its blocks' surfaces
 * (files of the render's zip, `GET /sync/downloadRenderFile/.../{path}` with the path url-encoded as one segment), and the
 * diff's B - A arrays (`GET /sync/diffField/.../{path}`). Each revision's files are fetched once and kept.
 */
import type { ICellKind, ISimulationGeometry, ISimulationScene, IVtkJsArray, IVtkJsDataset } from './simulation.types'

export interface ISimulationRevisionRef {
  projectId: string
  fileId: string
  revisionId: string
}

export const renderFileUrl = ({ projectId, fileId, revisionId }: ISimulationRevisionRef, path: string) =>
  `${GLOBAL_ENV.API_SERVER}/api/v1/sync/downloadRenderFile/${projectId}/${fileId}/${revisionId}/${encodeURIComponent(path)}`

export const diffFieldUrl = (
  {
    projectId,
    fileId,
    revisionA,
    revisionB,
  }: { projectId: string; fileId: string; revisionA: string; revisionB: string },
  path: string,
) => `${GLOBAL_ENV.API_SERVER}/api/v1/sync/diffField/${projectId}/${fileId}/${revisionA}/${revisionB}/${path}`

const request = async (url: string, token?: string | null, signal?: AbortSignal) => {
  const response = await fetch(url, { headers: token ? { Authorization: `bearer ${token}` } : {}, signal })
  if (!response.ok) {
    let message = `The simulation result could not be downloaded (${response.status}).`
    try {
      message = (await response.json()).error.message || message
    } catch {}
    throw new Error(message)
  }
  return response
}

const typedArrays = {
  Float32Array,
  Uint32Array,
}

/** An array of a vtk.js dataset from its little endian file */
export const parseArray = (array: IVtkJsArray, buffer: ArrayBuffer) => {
  const values = new typedArrays[array.dataType](buffer)
  if (values.length !== array.size)
    throw new Error(`The array ${array.name} has ${values.length} values, not ${array.size}.`)
  return values
}

export const cellKinds: ICellKind[] = ['verts', 'lines', 'polys', 'strips']

/** One revision of a simulation result: its scene model, block surfaces and field arrays, each fetched once */
export class SimulationRevision {
  private cache = new Map<string, Promise<any>>()

  constructor(
    public readonly ref: ISimulationRevisionRef,
    private readonly token?: string | null,
    private readonly signal?: AbortSignal,
  ) {}

  private once<T>(key: string, load: () => Promise<T>): Promise<T> {
    if (!this.cache.has(key)) this.cache.set(key, load())
    return this.cache.get(key) as Promise<T>
  }

  private file(path: string) {
    return request(renderFileUrl(this.ref, path), this.token, this.signal)
  }

  public scene(): Promise<ISimulationScene> {
    return this.once('scene', async () => (await this.file('scene.json')).json())
  }

  private dataset(block: number): Promise<IVtkJsDataset> {
    return this.once(`dataset-${block}`, async () => (await this.file(`blocks/${block}/index.json`)).json())
  }

  private array(block: number, array: IVtkJsArray) {
    return this.once(`array-${block}-${array.ref.id}`, async () =>
      parseArray(array, await (await this.file(`blocks/${block}/${array.ref.basepath}/${array.ref.id}`)).arrayBuffer()),
    )
  }

  /** A block's surface: points and cells, and where its field arrays are */
  public geometry(block: number): Promise<ISimulationGeometry> {
    return this.once(`geometry-${block}`, async () => {
      const dataset = await this.dataset(block)
      const kinds = cellKinds.filter((kind) => dataset[kind])
      const [points, ...cells] = await Promise.all([
        this.array(block, dataset.points),
        ...kinds.map((kind) => this.array(block, dataset[kind] as IVtkJsArray)),
      ])
      const fieldArrays = Object.fromEntries(
        [...dataset.pointData.arrays, ...dataset.cellData.arrays].map(({ data }) => [data.ref.id, data]),
      )
      return {
        points: points as Float32Array,
        cells: Object.fromEntries(kinds.map((kind, index) => [kind, cells[index] as Uint32Array])),
        fieldArrays,
      }
    })
  }

  /** A field's values on a block's surface (components interleaved), by its index among the block's fields */
  public async field(block: number, index: number): Promise<Float32Array | null> {
    const geometry = await this.geometry(block)
    const array = geometry.fieldArrays[`field-${index}`]
    return array ? ((await this.array(block, array)) as Float32Array) : null
  }
}

/** The diff's B - A arrays, each fetched once */
export class SimulationDeltas {
  private cache = new Map<string, Promise<Float32Array>>()

  constructor(
    private readonly diff: { projectId: string; fileId: string; revisionA: string; revisionB: string },
    private readonly token?: string | null,
    private readonly signal?: AbortSignal,
  ) {}

  public get(path: string) {
    if (!this.cache.has(path)) {
      this.cache.set(
        path,
        request(diffFieldUrl(this.diff, path), this.token, this.signal).then(
          async (response) => new Float32Array(await response.arrayBuffer()),
        ),
      )
    }
    return this.cache.get(path) as Promise<Float32Array>
  }
}
