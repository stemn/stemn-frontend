import type { Camera, PerspectiveCamera } from 'three'
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export interface ILinkedView {
  camera: Camera
  controls: OrbitControls
  invalidate: () => void
}

/** Keeps the cameras of the side-by-side panes on the same view: whichever pane the user moves, the other follows */
export class CameraLink {
  private views = new Set<ILinkedView>()
  private syncing = false
  private last: ILinkedView | null = null

  /** Links a pane; a pane that mounts after the other has moved (or fitted) starts on the same view */
  public add(view: ILinkedView) {
    this.views.add(view)
    if (this.last && this.last !== view) this.copy(this.last, view)
    return () => {
      this.views.delete(view)
      if (this.last === view) this.last = null
    }
  }

  public moved(source: ILinkedView) {
    if (this.syncing) return
    this.last = source
    this.views.forEach((view) => {
      if (view !== source) this.copy(source, view)
    })
  }

  private copy(source: ILinkedView, view: ILinkedView) {
    // the follower's controls report the change too: ignore it rather than echo it back
    this.syncing = true
    const camera = view.camera as PerspectiveCamera
    const from = source.camera as PerspectiveCamera
    camera.position.copy(from.position)
    camera.quaternion.copy(from.quaternion)
    camera.near = from.near
    camera.far = from.far
    camera.updateProjectionMatrix()
    view.controls.target.copy(source.controls.target)
    view.controls.update()
    view.invalidate()
    this.syncing = false
  }
}
