/**
 * The canvas of the G-code viewer (lazy chunk, with three.js): draws one or two toolpaths (revision A and B overlaid,
 * or one pane of the side-by-side diff) layer by layer, each layer as its caller says (features, a diff appearance or
 * hidden), up to a height, with or without travel moves, and an overlay of single moves (the segment comparison).
 */
import { Canvas, type ThreeEvent, useThree } from '@react-three/fiber'
import * as React from 'react'
import { Box3, Group, type PerspectiveCamera, Vector3 } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { CameraLink, ILinkedView } from '../../../FileDiff/FileDiffView/cameraLink'
import { fitCamera } from '../PreviewCadOss/PreviewCadOss.utils'
import {
  disposeGroup,
  type ILayerLook,
  type IToolpathModel,
  type IToolpathSide,
  overlayLines,
  pickedLayer,
  segmentLine,
  setLayerLook,
  worldBox,
} from './toolpath.three'

export interface IToolpathOverlay {
  side: IToolpathSide
  layer: number
  indexes: number[]
  colour: string
}

export interface IToolpathCanvasProps {
  models: Array<{ side: IToolpathSide; model: IToolpathModel }>
  /** How each layer of each side is drawn, and where (a translation in millimetres, for the A -> B slider) */
  lookOf: (side: IToolpathSide, layer: number) => { look: ILayerLook; offset?: number[] }
  /** Layers above this height are hidden */
  maxZ: number
  showTravel: boolean
  overlays?: IToolpathOverlay[]
  lines?: Array<{ from: number[]; to: number[]; colour: string }>
  /** What a fit request fits, in the printer's frame (null: everything) */
  fitBox?: Box3 | null
  fitRequest: number
  onPick?: (picked: { side: IToolpathSide; layer: number } | null) => void
  cameraLink?: CameraLink
  primary?: boolean
  label: string
  testId: string
}

const Contents = ({
  models,
  lookOf,
  maxZ,
  showTravel,
  overlays = [],
  lines = [],
  fitBox,
  fitRequest,
  onPick,
  cameraLink,
  primary = true,
}: Omit<IToolpathCanvasProps, 'label' | 'testId'>) => {
  const { camera, gl, invalidate, get, scene, raycaster } = useThree()
  const controlsRef = React.useRef<OrbitControls | null>(null)
  const viewRef = React.useRef<ILinkedView | null>(null)
  // overlays and lines are in the printer's frame, like the layers: under a root turned the same way
  const extras = React.useMemo(() => {
    const group = new Group()
    group.name = 'toolpath-overlays'
    group.rotation.x = -Math.PI / 2
    return group
  }, [])

  React.useEffect(() => {
    const orbit = new OrbitControls(camera, gl.domElement)
    const view = { camera, controls: orbit, invalidate }
    const onChange = () => {
      invalidate()
      if (cameraLink) cameraLink.moved(view)
    }
    orbit.addEventListener('change', onChange)
    controlsRef.current = orbit
    viewRef.current = view
    const unlink = cameraLink ? cameraLink.add(view) : undefined
    return () => {
      if (unlink) unlink()
      orbit.removeEventListener('change', onChange)
      orbit.dispose()
    }
  }, [camera, gl, invalidate, cameraLink])

  React.useEffect(() => {
    scene.add(extras)
    return () => {
      disposeGroup(extras)
      scene.remove(extras)
    }
  }, [scene, extras])

  // lines are thin: pick within a fraction of a millimetre-scaled model
  React.useEffect(() => {
    const size = models.length ? models[0].model.toolpath.bounds : null
    const extent = size ? Math.max(size.max[0] - size.min[0], size.max[1] - size.min[1], 1) : 100
    raycaster.params.Line = { threshold: extent / 400 }
  }, [models, raycaster])

  // every layer's look, height and travel
  React.useEffect(() => {
    models.forEach(({ side, model }) => {
      model.layers.forEach((objects, index) => {
        const { look, offset } = lookOf(side, index)
        const layer = model.toolpath.layers[index]
        setLayerLook(objects, layer.z <= maxZ + 1e-6 ? look : null)
        objects.group.position.set(offset ? offset[0] : 0, offset ? offset[1] : 0, offset ? offset[2] : 0)
        if (objects.travel) objects.travel.visible = showTravel
      })
    })
    disposeGroup(extras)
    overlays.forEach((overlay) => {
      const entry = models.find(({ side }) => side === overlay.side)
      if (!entry || !overlay.indexes.length) return
      const { toolpath } = entry.model
      extras.add(overlayLines(toolpath, toolpath.layers[overlay.layer], overlay.indexes, overlay.colour))
    })
    lines.forEach((line) => extras.add(segmentLine(line.from, line.to, line.colour)))
    invalidate()
  }, [models, lookOf, maxZ, showTravel, overlays, lines, extras, invalidate])

  const fitBoxRef = React.useRef<Box3 | null | undefined>(fitBox)
  fitBoxRef.current = fitBox

  // fit the selection, or the whole toolpath, when asked and when the toolpaths load
  React.useEffect(() => {
    if (!primary || !models.length) return
    const whole = new Box3()
    models.forEach(({ model }) => {
      const { min, max } = model.toolpath.bounds
      whole.union(worldBox(new Box3(new Vector3().fromArray(min), new Vector3().fromArray(max)), model.root))
    })
    const box = fitBoxRef.current ? worldBox(fitBoxRef.current, models[0].model.root) : whole
    const { size } = get()
    const perspective = camera as PerspectiveCamera
    const fit = fitCamera(box, perspective.fov || 45, size.width / Math.max(size.height, 1), 1.15)
    perspective.position.copy(fit.position)
    perspective.near = fit.near
    perspective.far = fit.far * 2
    perspective.updateProjectionMatrix()
    if (controlsRef.current) {
      controlsRef.current.target.copy(fit.target)
      controlsRef.current.update()
    }
    if (cameraLink && viewRef.current) cameraLink.moved(viewRef.current)
    invalidate()
  }, [fitRequest, models, primary, camera, cameraLink, get, invalidate])

  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    // a drag of the orbit controls is not a click
    if (event.delta > 4 || !onPick) return
    const hit = event.intersections.find(
      (intersection) => intersection.object.visible && intersection.object.parent?.visible,
    )
    const picked = hit ? pickedLayer(hit.object) : null
    onPick(picked && picked.side ? { side: picked.side, layer: picked.layer } : null)
  }

  return (
    <>
      {models.map(({ side, model }) => (
        <primitive key={side} object={model.root} dispose={null} onClick={onClick} />
      ))}
    </>
  )
}

export const ToolpathCanvas = ({ label, testId, ...props }: IToolpathCanvasProps) => (
  <div className="flex rel-box" data-testid={testId} style={{ minHeight: 0 }}>
    <Canvas
      frameloop="demand"
      camera={{ fov: 45, position: [1, 1, 1] }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      aria-label={label}
      onPointerMissed={() => props.onPick && props.onPick(null)}
    >
      <Contents {...props} />
    </Canvas>
  </div>
)

export default ToolpathCanvas
