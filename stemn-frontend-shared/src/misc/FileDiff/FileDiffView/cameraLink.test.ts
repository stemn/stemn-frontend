import { PerspectiveCamera, Vector3 } from 'three'
import { describe, expect, it, vi } from 'vitest'
import { CameraLink, type ILinkedView } from './cameraLink'

// a pane: its camera, and controls whose update() reports a change like OrbitControls do
const pane = (link: CameraLink): ILinkedView => {
  const view: ILinkedView = {
    camera: new PerspectiveCamera(),
    controls: { target: new Vector3(), update: () => link.moved(view) } as any,
    invalidate: vi.fn(),
  }
  return view
}

describe('the side-by-side camera link', () => {
  it('moves the other pane with the one the user moved, without echoing back', () => {
    const link = new CameraLink()
    const [left, right] = [pane(link), pane(link)]
    link.add(left)
    link.add(right)
    left.camera.position.set(1, 2, 3)
    left.controls.target.set(0, 1, 0)
    link.moved(left)
    expect(right.camera.position.toArray()).toEqual([1, 2, 3])
    expect(right.controls.target.toArray()).toEqual([0, 1, 0])
    expect(right.invalidate).toHaveBeenCalledTimes(1)
    expect(left.invalidate).not.toHaveBeenCalled()
  })

  it('starts a pane that mounts later on the view of the last moved one, and forgets removed panes', () => {
    const link = new CameraLink()
    const left = pane(link)
    const removeLeft = link.add(left)
    left.camera.position.set(4, 5, 6)
    link.moved(left)
    const right = pane(link)
    link.add(right)
    expect(right.camera.position.toArray()).toEqual([4, 5, 6])
    removeLeft()
    const third = pane(link)
    link.add(third)
    expect(third.camera.position.toArray()).toEqual([0, 0, 0])
  })
})
