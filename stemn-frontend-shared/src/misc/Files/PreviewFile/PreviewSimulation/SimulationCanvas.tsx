/**
 * A vtk.js canvas of simulation blocks (see simulation.vtk.ts): draws what it is given, fits the camera when asked,
 * reports clicks on a block, and in the side-by-side view shares its camera with the other pane through a camera link.
 */
import * as React from 'react'
import type { IClip } from './simulation.types'
import { type IDrawable, type ILine, type SimulationCameraLink, SimulationViewer } from './simulation.vtk'

export interface ISimulationCanvasProps {
  drawables: IDrawable[]
  lines?: ILine[]
  clip?: IClip | null
  /** Bumped to fit the camera to `fitEntities` (or everything) */
  fitRequest: number
  fitEntities?: string[]
  onPick?: (entityId: string | null) => void
  cameraLink?: SimulationCameraLink
  /** Only the primary pane of a linked pair fits; the other follows its camera */
  primary?: boolean
  label: string
  testId: string
  children?: React.ReactNode
}

export const SimulationCanvas = ({
  drawables,
  lines = [],
  clip = null,
  fitRequest,
  fitEntities,
  onPick,
  cameraLink,
  primary = true,
  label,
  testId,
  children,
}: ISimulationCanvasProps) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [viewer, setViewer] = React.useState<SimulationViewer | null>(null)
  const fittedRef = React.useRef(false)
  const pointerRef = React.useRef<[number, number] | null>(null)

  React.useEffect(() => {
    if (!containerRef.current) return
    const created = new SimulationViewer(containerRef.current)
    const unlink = cameraLink ? cameraLink.add(created) : () => {}
    setViewer(created)
    return () => {
      unlink()
      created.dispose()
      setViewer(null)
    }
  }, [cameraLink])

  React.useEffect(() => {
    if (!viewer) return
    viewer.setDrawables(drawables)
    // the first time there is something to draw, frame it
    if (!fittedRef.current && drawables.length && primary) {
      fittedRef.current = true
      viewer.fit(undefined, true)
    }
  }, [viewer, drawables, primary])

  React.useEffect(() => {
    viewer?.setLines(lines)
  }, [viewer, lines])

  React.useEffect(() => {
    viewer?.setClip(clip)
  }, [viewer, clip])

  const fitKey = (fitEntities || []).join('\n')
  React.useEffect(() => {
    if (viewer && fitRequest && primary) viewer.fit(fitKey ? fitKey.split('\n') : undefined)
  }, [viewer, fitRequest, fitKey, primary])

  // a click (not the end of a drag) picks the block under the pointer, or clears the selection
  const onPointerDown = (event: React.PointerEvent) => {
    pointerRef.current = [event.clientX, event.clientY]
  }
  const onPointerUp = (event: React.PointerEvent) => {
    const start = pointerRef.current
    pointerRef.current = null
    if (!viewer || !onPick || !start) return
    if (Math.hypot(event.clientX - start[0], event.clientY - start[1]) > 4) return
    onPick(viewer.pick(event.clientX, event.clientY))
  }

  return (
    <div className="layout-column flex rel-box" data-testid={testId} aria-label={label} role="img">
      <div
        ref={containerRef}
        className="flex"
        style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      />
      {children}
    </div>
  )
}
