/**
 * The simulation viewer's renderer: vtk.js (WebGL 2), only in the simulation chunks. Only the classes it uses are
 * imported, with their OpenGL implementations registered one by one (no rendering profile, no WebGPU), so the chunk
 * stays small and shares nothing with three.js. A viewer draws each block of a revision as one actor, coloured flat or by
 * per-point or per-cell colours, and two viewers can share a camera (side by side).
 */
import '@kitware/vtk.js/Rendering/OpenGL/Actor'
import '@kitware/vtk.js/Rendering/OpenGL/Camera'
import '@kitware/vtk.js/Rendering/OpenGL/PolyDataMapper'
import '@kitware/vtk.js/Rendering/OpenGL/Renderer'
import '@kitware/vtk.js/Rendering/OpenGL/Texture'
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray'
import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane'
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData'
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera'
import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow'
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor'
import vtkCellPicker from '@kitware/vtk.js/Rendering/Core/CellPicker'
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper'
import { ColorMode, ScalarMode } from '@kitware/vtk.js/Rendering/Core/Mapper/Constants'
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer'
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow'
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor'
import type { IClip, IFieldAssociation, ISimulationGeometry } from './simulation.types'

/** How one actor (a revision's copy of a block) is drawn */
export interface IDrawable {
  key: string
  /** The diff entity (or scene entity) it draws, for picking */
  entityId: string
  geometry: ISimulationGeometry
  colour: string
  opacity: number
  /** A translation, e.g. to move a block back towards its A placement */
  offset?: number[]
  /** Per point or per cell colours (RGB), drawn instead of the flat colour */
  colours?: { association: IFieldAssociation; rgb: Uint8Array } | null
  /** Show the cell edges (the selection) */
  edges?: boolean
}

export interface ILine {
  key: string
  from: number[]
  to: number[]
  colour: string
}

const rgb = (colour: string) => {
  const hex = colour.replace('#', '')
  return [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255) as [number, number, number]
}

const toPolyData = (geometry: ISimulationGeometry) => {
  const polydata = vtkPolyData.newInstance()
  polydata.getPoints().setData(geometry.points, 3)
  ;(['verts', 'lines', 'polys', 'strips'] as const).forEach((kind) => {
    const cells = geometry.cells[kind]
    if (cells) (polydata as any)[`get${kind[0].toUpperCase()}${kind.slice(1)}`]().setData(cells)
  })
  return polydata
}

const unionBounds = (bounds: number[][]) =>
  bounds.length
    ? [0, 1, 2].flatMap((axis) => [
        Math.min(...bounds.map((box) => box[axis * 2])),
        Math.max(...bounds.map((box) => box[axis * 2 + 1])),
      ])
    : null

interface IActorEntry {
  actor: ReturnType<typeof vtkActor.newInstance>
  mapper: ReturnType<typeof vtkMapper.newInstance>
  polydata: ReturnType<typeof vtkPolyData.newInstance>
  geometry: ISimulationGeometry | null
  entityId: string
}

// renders that the viewers start themselves: the camera changes they cause are not passed to linked viewers
let rendering = false

export class SimulationViewer {
  private renderWindow = vtkRenderWindow.newInstance()
  private renderer = vtkRenderer.newInstance()
  private glWindow = vtkOpenGLRenderWindow.newInstance()
  private interactor = vtkRenderWindowInteractor.newInstance()
  private picker = vtkCellPicker.newInstance()
  private actors = new Map<string, IActorEntry>()
  private lines = new Map<string, IActorEntry>()
  private clipPlane = vtkPlane.newInstance()
  private clip: IClip | null = null
  private frame = 0
  private observer: ResizeObserver | null = null
  private cameraSubscription: { unsubscribe: () => void } | null = null
  public linked = new Set<SimulationViewer>()

  constructor(private readonly container: HTMLElement) {
    // the drawing buffer is kept between frames, so screenshots (and the e2e tests) can read the canvas: the context
    // is made here with that attribute, and vtk.js gets the same context when it asks the canvas for one later
    ;(this.glWindow.getCanvas() as HTMLCanvasElement).getContext('webgl2', {
      preserveDrawingBuffer: true,
      depth: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setBackground(0, 0, 0, 0)
    this.renderWindow.addRenderer(this.renderer)
    this.renderWindow.addView(this.glWindow)
    this.glWindow.setContainer(container)
    this.interactor.setView(this.glWindow)
    this.interactor.initialize()
    this.interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance())
    this.interactor.bindEvents(container)
    this.picker.setPickFromList(true)
    this.picker.setTolerance(0)
    this.watchCamera()
    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => this.resize())
      this.observer.observe(container)
    }
    this.resize()
  }

  public get canvas(): HTMLCanvasElement {
    return this.glWindow.getCanvas() as HTMLCanvasElement
  }

  private watchCamera() {
    this.cameraSubscription?.unsubscribe()
    this.cameraSubscription = this.renderer.getActiveCamera().onModified(() => {
      if (rendering) return
      this.linked.forEach((viewer) => viewer.render())
    })
  }

  /** Draws this viewer with another's camera, and each follows the other */
  public shareCamera(other: SimulationViewer) {
    this.renderer.setActiveCamera(other.renderer.getActiveCamera())
    this.watchCamera()
    this.linked.add(other)
    other.linked.add(this)
    this.render()
  }

  public unlink() {
    this.linked.forEach((viewer) => viewer.linked.delete(this))
    this.linked.clear()
  }

  public resize() {
    const { width, height } = this.container.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    this.glWindow.setSize(Math.max(1, Math.floor(width * ratio)), Math.max(1, Math.floor(height * ratio)))
    this.render()
  }

  /** Renders on the next frame (once however often it is asked) */
  public render() {
    if (this.frame) return
    this.frame = requestAnimationFrame(() => {
      this.frame = 0
      rendering = true
      try {
        this.renderWindow.render()
      } finally {
        rendering = false
      }
    })
  }

  private entry(key: string, entityId: string, map: Map<string, IActorEntry>) {
    let entry = map.get(key)
    if (!entry) {
      const polydata = vtkPolyData.newInstance()
      const mapper = vtkMapper.newInstance()
      const actor = vtkActor.newInstance()
      mapper.setInputData(polydata)
      actor.setMapper(mapper)
      this.renderer.addActor(actor)
      entry = { actor, mapper, polydata, geometry: null, entityId }
      map.set(key, entry)
    }
    return entry
  }

  /** Draws exactly these blocks (the others are removed) */
  public setDrawables(drawables: IDrawable[]) {
    const keys = new Set(drawables.map((drawable) => drawable.key))
    this.actors.forEach((entry, key) => {
      if (!keys.has(key)) {
        this.renderer.removeActor(entry.actor)
        this.actors.delete(key)
      }
    })
    drawables.forEach((drawable) => {
      const entry = this.entry(drawable.key, drawable.entityId, this.actors)
      if (entry.geometry !== drawable.geometry) {
        entry.polydata = toPolyData(drawable.geometry)
        entry.mapper.setInputData(entry.polydata)
        entry.geometry = drawable.geometry
      }
      entry.entityId = drawable.entityId
      const property = entry.actor.getProperty()
      const colour = rgb(drawable.colour)
      // some ambient light, so faces the headlight grazes are not black (the thumbnails use the same)
      property.setColor(...colour)
      property.setAmbientColor(...colour)
      property.setDiffuseColor(...colour)
      property.setAmbient(0.35)
      property.setDiffuse(0.7)
      property.setOpacity(drawable.opacity)
      property.setEdgeVisibility(Boolean(drawable.edges))
      property.setEdgeColor(0.12, 0.13, 0.16)
      property.setPointSize(4)
      entry.actor.setPosition(...((drawable.offset || [0, 0, 0]) as [number, number, number]))
      const [pointData, cellData] = [entry.polydata.getPointData(), entry.polydata.getCellData()]
      pointData.removeArray('colours')
      cellData.removeArray('colours')
      if (drawable.colours) {
        const colours = vtkDataArray.newInstance({
          name: 'colours',
          values: drawable.colours.rgb,
          numberOfComponents: 3,
        })
        ;(drawable.colours.association === 'point' ? pointData : cellData).setScalars(colours)
        entry.mapper.setScalarVisibility(true)
        entry.mapper.setColorMode(ColorMode.DIRECT_SCALARS)
        entry.mapper.setScalarMode(
          drawable.colours.association === 'point' ? ScalarMode.USE_POINT_DATA : ScalarMode.USE_CELL_DATA,
        )
      } else {
        entry.mapper.setScalarVisibility(false)
      }
      entry.polydata.modified()
    })
    this.applyClip()
    this.render()
  }

  /** The thin displacement lines of moved blocks */
  public setLines(lines: ILine[]) {
    const keys = new Set(lines.map((line) => line.key))
    this.lines.forEach((entry, key) => {
      if (!keys.has(key)) {
        this.renderer.removeActor(entry.actor)
        this.lines.delete(key)
      }
    })
    lines.forEach((line) => {
      const entry = this.entry(line.key, line.key, this.lines)
      entry.polydata = vtkPolyData.newInstance()
      entry.polydata.getPoints().setData(Float32Array.from([...line.from, ...line.to]), 3)
      entry.polydata.getLines().setData(Uint32Array.from([2, 0, 1]))
      entry.mapper.setInputData(entry.polydata)
      entry.mapper.setScalarVisibility(false)
      entry.actor.getProperty().setColor(...rgb(line.colour))
      entry.actor.getProperty().setLineWidth(2)
      entry.actor.setPickable(false)
    })
    this.render()
  }

  /** The bounds of the blocks drawn for some entities (all of them by default) */
  public bounds(entityIds?: string[]) {
    const boxes: number[][] = []
    this.actors.forEach((entry) => {
      if (entityIds && !entityIds.includes(entry.entityId)) return
      if (entry.actor.getProperty().getOpacity() === 0) return
      const box = entry.actor.getBounds()
      if (box && box[0] <= box[1]) boxes.push(box)
    })
    return unionBounds(boxes)
  }

  /**
   * Frames the blocks of some entities (or everything). `turn` also turns the camera to look from the front right, above
   * (the thumbnails' view), as the first view of a model
   */
  public fit(entityIds?: string[], turn = false) {
    const box = (entityIds && entityIds.length && this.bounds(entityIds)) || this.bounds()
    if (!box) return
    if (turn) {
      const camera = this.renderer.getActiveCamera()
      const centre = [0, 1, 2].map((axis) => (box[axis * 2] + box[axis * 2 + 1]) / 2)
      camera.setFocalPoint(centre[0], centre[1], centre[2])
      camera.setPosition(centre[0] + 1, centre[1] + 0.8, centre[2] + 1.2)
      camera.setViewUp(0, 1, 0)
    }
    this.renderer.resetCamera(box as [number, number, number, number, number, number])
    this.render()
  }

  /** A clipping plane across everything drawn, keeping the side below the fraction; null for none */
  public setClip(clip: IClip | null) {
    this.clip = clip
    this.applyClip()
    this.render()
  }

  private applyClip() {
    const box = this.clip && this.bounds()
    this.actors.forEach((entry) => entry.mapper.removeAllClippingPlanes())
    if (!this.clip || !box) return
    const normal = [0, 0, 0]
    normal[this.clip.axis] = -1
    const origin = [0, 1, 2].map((axis) => (box[axis * 2] + box[axis * 2 + 1]) / 2)
    const { axis, fraction } = this.clip
    origin[axis] = box[axis * 2] + (box[axis * 2 + 1] - box[axis * 2]) * fraction
    this.clipPlane.setNormal(normal as [number, number, number])
    this.clipPlane.setOrigin(origin as [number, number, number])
    this.actors.forEach((entry) => entry.mapper.addClippingPlane(this.clipPlane))
  }

  /** The entity under a point of the page, or null */
  public pick(clientX: number, clientY: number) {
    const rect = this.container.getBoundingClientRect()
    const ratio = this.glWindow.getSize()[0] / Math.max(rect.width, 1)
    this.picker.initializePickList()
    this.actors.forEach((entry) => {
      if (entry.actor.getProperty().getOpacity() > 0 && entry.actor.getVisibility())
        this.picker.addPickList(entry.actor)
    })
    this.picker.pick([(clientX - rect.left) * ratio, (rect.bottom - clientY) * ratio, 0], this.renderer)
    const [actor] = this.picker.getActors()
    if (!actor) return null
    let picked: string | null = null
    this.actors.forEach((entry) => {
      if (entry.actor === actor) picked = entry.entityId
    })
    return picked
  }

  public dispose() {
    if (this.frame) cancelAnimationFrame(this.frame)
    this.observer?.disconnect()
    this.cameraSubscription?.unsubscribe()
    this.unlink()
    this.interactor.unbindEvents()
    this.glWindow.setContainer(null as any)
    this.interactor.delete()
    this.glWindow.delete()
    this.renderWindow.delete()
  }
}

/** The panes of a side-by-side view: the second pane to mount takes the first one's camera */
export class SimulationCameraLink {
  private viewers = new Set<SimulationViewer>()

  public add(viewer: SimulationViewer) {
    const [first] = Array.from(this.viewers)
    this.viewers.add(viewer)
    if (first) viewer.shareCamera(first)
    return () => {
      viewer.unlink()
      this.viewers.delete(viewer)
    }
  }
}
