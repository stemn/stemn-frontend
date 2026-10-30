/**
 * The canvas of the diff viewer: one three.js scene with A and B overlaid (unified view), or one pane of the
 * side-by-side view, whose camera follows the other pane's through a CameraLink.
 */
import { Canvas, type ThreeEvent, useThree } from '@react-three/fiber'
import * as React from 'react'
import type { Object3D, PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { fitCamera } from '../../Files/PreviewFile/PreviewCadOss/PreviewCadOss.utils'
import type { IDiffEntity } from '../diff.types'
import { diffColours, type IDiffAppearance } from '../diff.utils'
import type { CameraLink, ILinkedView } from './cameraLink'
import {
  applyAppearance,
  disposeLines,
  displacementLine,
  entityNode,
  type IDiffModel,
  type IDiffSide,
  idsByNode,
  lineGroup,
  pickedEntity,
  placeAlongMove,
  setOutline,
  visibleBounds,
} from './diff.scene'

export type IAppearanceFor = (entity: IDiffEntity) => {
  a: IDiffAppearance | null
  b: IDiffAppearance | null
  line?: boolean
}

export interface IDiffCanvasProps {
  /** Revision A's model (unified view, or the left pane) */
  modelA?: IDiffModel | null
  /** Revision B's model (unified view, or the right pane) */
  modelB?: IDiffModel | null
  entities: IDiffEntity[]
  appearanceFor: IAppearanceFor
  selected: string | null
  hovered: string | null
  onPick: (id: string | null) => void
  onHover: (id: string | null) => void
  /** Bumped to fit the camera to the selection (or everything visible) */
  fitRequest: number
  /** Side-by-side: the link between the panes' cameras; only the primary pane fits, the other follows */
  cameraLink?: CameraLink
  primary?: boolean
  label: string
  testId: string
}

const isShown = (object: Object3D | null) => {
  let node = object
  while (node) {
    if (!node.visible) return false
    node = node.parent
  }
  return true
}

/** The nodes that draw an entity in the models of this canvas */
const nodesOf = (entity: IDiffEntity | undefined, modelA?: IDiffModel | null, modelB?: IDiffModel | null) =>
  entity
    ? [entityNode(modelA || null, entity, 'a'), entityNode(modelB || null, entity, 'b')].filter(
        (node): node is Object3D => Boolean(node),
      )
    : []

const SceneContents = ({
  modelA,
  modelB,
  entities,
  appearanceFor,
  selected,
  hovered,
  onPick,
  onHover,
  fitRequest,
  cameraLink,
  primary = true,
}: Omit<IDiffCanvasProps, 'label' | 'testId'>) => {
  const { camera, gl, invalidate, get, scene } = useThree()
  const controlsRef = React.useRef<OrbitControls | null>(null)
  const viewRef = React.useRef<ILinkedView | null>(null)
  const lines = React.useMemo(() => lineGroup(), [])
  const ids = React.useMemo(
    () => [
      { side: 'a' as IDiffSide, ids: idsByNode(modelA || null) },
      { side: 'b' as IDiffSide, ids: idsByNode(modelB || null) },
    ],
    [modelA, modelB],
  )

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
    scene.add(lines)
    return () => {
      disposeLines(lines)
      scene.remove(lines)
    }
  }, [scene, lines])

  // the class appearances, the placements along the slider, and the displacement lines
  React.useEffect(() => {
    disposeLines(lines)
    entities.forEach((entity) => {
      const appearance = appearanceFor(entity)
      const nodeA = entityNode(modelA || null, entity, 'a')
      const nodeB = entityNode(modelB || null, entity, 'b')
      if (modelA) applyAppearance(nodeA, appearance.a)
      if (modelB) {
        applyAppearance(nodeB, appearance.b)
        const placement = appearance.b?.placement
        placeAlongMove(nodeA, nodeB, placement === undefined ? 1 : placement)
      }
      if (appearance.line && modelA && modelB) {
        const line = displacementLine(entity, diffColours[entity.class])
        if (line) lines.add(line)
      }
    })
    invalidate()
  }, [entities, appearanceFor, modelA, modelB, lines, invalidate])

  // outlines: the hovered entity in its class colour, the selected one in black
  React.useEffect(() => {
    const outlined = [
      { id: hovered, colour: null as string | null },
      { id: selected, colour: '#1f2328' },
    ]
      .filter(({ id }) => id)
      .map(({ id, colour }) => {
        const entity = entities.find((candidate) => candidate.id === id)
        const nodes = nodesOf(entity, modelA, modelB)
        const outline = colour || (entity ? diffColours[entity.class] : null)
        nodes.forEach((node) => setOutline(node, outline))
        return nodes
      })
    invalidate()
    return () => {
      outlined.flat().forEach((node) => setOutline(node, null))
    }
  }, [hovered, selected, entities, modelA, modelB, invalidate])

  // what a fit request fits: the latest selection, read when the request comes rather than on every selection
  const fitTargetRef = React.useRef<IDiffEntity | undefined>(undefined)
  fitTargetRef.current = selected ? entities.find((candidate) => candidate.id === selected) : undefined

  // fit the selection, or everything visible, when asked and when the models load
  React.useEffect(() => {
    if (!primary) return
    const roots = [modelA, modelB].filter((model): model is IDiffModel => Boolean(model)).map((model) => model.root)
    let box = visibleBounds(fitTargetRef.current ? nodesOf(fitTargetRef.current, modelA, modelB) : roots)
    if (box.isEmpty()) box = visibleBounds(roots)
    if (box.isEmpty()) return
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
  }, [fitRequest, modelA, modelB, primary, camera, cameraLink, get, invalidate])

  const visibleHit = (event: ThreeEvent<PointerEvent | MouseEvent>) => {
    const hit = event.intersections.find((intersection) => isShown(intersection.object))
    return hit ? pickedEntity(hit.object, ids) : null
  }

  const handlers = {
    onPointerMove: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation()
      const picked = visibleHit(event)
      const entity = picked
        ? entities.find((candidate) => (picked.side === 'a' ? candidate.idA : candidate.idB) === picked.id)
        : null
      onHover(entity ? entity.id : null)
    },
    onPointerOut: () => onHover(null),
    onClick: (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation()
      // a drag of the orbit controls is not a click
      if (event.delta > 4) return
      const picked = visibleHit(event)
      const entity = picked
        ? entities.find((candidate) => (picked.side === 'a' ? candidate.idA : candidate.idB) === picked.id)
        : null
      onPick(entity ? entity.id : null)
    },
  }

  return (
    <>
      <hemisphereLight args={[0xffffff, 0x8a8f99, 1.4]} />
      <directionalLight position={[2, 3, 4]} intensity={1.8} />
      <directionalLight position={[-3, -1, -2]} intensity={0.6} />
      {modelA ? <primitive object={modelA.root} dispose={null} {...handlers} /> : null}
      {modelB ? <primitive object={modelB.root} dispose={null} {...handlers} /> : null}
    </>
  )
}

export const DiffCanvas = ({ label, testId, ...props }: IDiffCanvasProps) => (
  <div className="flex rel-box" data-testid={testId} style={{ minHeight: 0 }}>
    <Canvas
      frameloop="demand"
      camera={{ fov: 45, position: [1, 1, 1] }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      aria-label={label}
      onPointerMissed={() => props.onPick(null)}
    >
      <SceneContents {...props} />
    </Canvas>
  </div>
)
