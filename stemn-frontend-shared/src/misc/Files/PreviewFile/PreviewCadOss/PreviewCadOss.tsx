/**
 * The open-source CAD viewer: three.js (via @react-three/fiber) showing the glTF 2.0 model that the backend's
 * OpenCascade converter produced for a render. Loaded as its own chunk (PreviewCadOssLoader) and picked by
 * PreviewCadSwitch for renders whose `cadProvider` is 'opencascade'. Nothing is fetched from a third party.
 */
import { Canvas, useThree } from '@react-three/fiber'
import * as React from 'react'
import { connect } from 'react-redux'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import { Box3, type Mesh, type MeshStandardMaterial, type Object3D, Plane } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CadSceneContext, type ICadSceneReady } from './CadSceneContext'
import { parseModel } from './PreviewCadOss.model'
import classes from './PreviewCadOss.module.scss'
import {
  cadProviderNames,
  fitCamera,
  type ICadPart,
  type ISectionAxis,
  nodesFromScene,
  partsFromScene,
  renderModelUrl,
  sectionPlane,
} from './PreviewCadOss.utils'

export interface IPreviewCadOssProps {
  fileMeta: { fileId: string; revisionId: string; name?: string; project: { _id: string } }
  fileRender?: { data?: any; cadProvider?: string }
  token?: string | null
  /** Called with the model and its nodes by stable id once it has loaded (the seam for a file-diff layer) */
  onSceneReady?: (scene: ICadSceneReady) => void
  /** Rendered inside the viewer with the scene in CadSceneContext (e.g. a diff legend) */
  children?: React.ReactNode
}

/** Fetches the glb with the user's token and prepares it (see prepareModel) */
const loadModel = async (url: string, token?: string | null) => {
  const response = await fetch(url, { headers: token ? { Authorization: `bearer ${token}` } : {} })
  if (!response.ok) {
    const text = await response.text()
    let message = `The 3D model could not be downloaded (${response.status}).`
    try {
      message = JSON.parse(text).error.message || message
    } catch {}
    throw new Error(message)
  }
  return parseModel(await response.arrayBuffer())
}

const noNodes = new Map<string, Object3D>()

interface ISceneProps {
  model: Object3D
  nodesById: Map<string, Object3D>
  wireframe: boolean
  section: boolean
  sectionAxis: ISectionAxis
  sectionFraction: number
  isolated: string | null
  fitRequest: number
}

/** Everything inside the canvas: lights, the model, orbit controls, fitting, and the material toggles */
const Scene = ({
  model,
  nodesById,
  wireframe,
  section,
  sectionAxis,
  sectionFraction,
  isolated,
  fitRequest,
}: ISceneProps) => {
  const { camera, gl, invalidate, get } = useThree()
  const controlsRef = React.useRef<OrbitControls | null>(null)
  const box = React.useMemo(() => new Box3().setFromObject(model), [model])
  const plane = React.useMemo(() => new Plane(), [])

  React.useEffect(() => {
    gl.localClippingEnabled = true
    const orbit = new OrbitControls(camera, gl.domElement)
    const onChange = () => invalidate()
    orbit.addEventListener('change', onChange)
    controlsRef.current = orbit
    return () => {
      orbit.removeEventListener('change', onChange)
      orbit.dispose()
    }
  }, [camera, gl, invalidate])

  // fit the model when it loads and when the fit button asks (not on resize, which would undo the user's view)
  React.useEffect(() => {
    const { size } = get()
    const fit = fitCamera(box, (camera as any).fov || 45, size.width / Math.max(size.height, 1))
    camera.position.copy(fit.position)
    camera.near = fit.near
    camera.far = fit.far
    camera.updateProjectionMatrix()
    if (controlsRef.current) {
      controlsRef.current.target.copy(fit.target)
      controlsRef.current.update()
    }
    invalidate()
  }, [box, fitRequest, camera, get, invalidate])

  React.useEffect(() => {
    sectionPlane(box, sectionAxis, sectionFraction, plane)
    // the isolated part and everything inside it stays opaque, the rest fades
    const isolatedObject = isolated ? nodesById.get(isolated) : null
    const opaque = new Set<string>()
    isolatedObject?.traverse((object) => opaque.add(object.uuid))
    model.traverse((object) => {
      const mesh = object as Mesh
      if (!mesh.isMesh) return
      const material = mesh.material as MeshStandardMaterial
      const faded = Boolean(isolatedObject) && !opaque.has(mesh.uuid)
      material.wireframe = wireframe
      material.clippingPlanes = section ? [plane] : null
      material.transparent = faded || mesh.userData.opacity < 1
      material.opacity = faded ? 0.12 : mesh.userData.opacity
      material.depthWrite = !faded
      material.needsUpdate = true
    })
    invalidate()
  }, [model, nodesById, box, plane, wireframe, section, sectionAxis, sectionFraction, isolated, invalidate])

  return (
    <>
      <hemisphereLight args={[0xffffff, 0x8a8f99, 1.4]} />
      <directionalLight position={[2, 3, 4]} intensity={1.8} />
      <directionalLight position={[-3, -1, -2]} intensity={0.6} />
      <primitive object={model} />
    </>
  )
}

export const PreviewCadOss = ({ fileMeta, token, onSceneReady, children }: IPreviewCadOssProps) => {
  const [loaded, setLoaded] = React.useState<{ url: string; model?: Object3D; error?: string } | null>(null)
  const [wireframe, setWireframe] = React.useState(false)
  const [section, setSection] = React.useState(false)
  const [sectionAxis, setSectionAxis] = React.useState<ISectionAxis>('x')
  const [sectionFraction, setSectionFraction] = React.useState(0.5)
  const [isolated, setIsolated] = React.useState<string | null>(null)
  const [fitRequest, setFitRequest] = React.useState(0)

  const url = renderModelUrl({
    projectId: fileMeta.project._id,
    fileId: fileMeta.fileId,
    revisionId: fileMeta.revisionId,
  })

  React.useEffect(() => {
    let cancelled = false
    loadModel(url, token)
      .then((model) => !cancelled && setLoaded({ url, model }))
      .catch((loadError) => !cancelled && setLoaded({ url, error: loadError.message }))
    return () => {
      cancelled = true
    }
  }, [url, token])

  // what was loaded for another file is never shown
  const current = loaded && loaded.url === url ? loaded : null
  const model = current && current.model ? current.model : null
  const error = current && current.error ? current.error : null

  const scene: ICadSceneReady | null = React.useMemo(
    () => (model ? { root: model, nodesById: nodesFromScene(model) } : null),
    [model],
  )
  const parts: ICadPart[] = React.useMemo(() => (scene ? partsFromScene(scene.root, scene.nodesById) : []), [scene])

  React.useEffect(() => {
    if (scene && onSceneReady) onSceneReady(scene)
  }, [scene, onSceneReady])
  const triangles = parts.reduce((total, part) => total + part.triangles, 0)

  if (error) {
    return (
      <div className="layout-column layout-align-center-center flex">
        <div className="text-title-5" data-testid="cad-error">
          {error}
        </div>
      </div>
    )
  }

  return (
    <CadSceneContext value={scene}>
      <div className={`${classes.viewer} layout-row flex rel-box`} data-testid="cad-viewer">
        <div className="layout-column flex rel-box">
          <div className={`${classes.toolbar} layout-row layout-align-start-center`}>
            <button
              type="button"
              className={classes.tool}
              onClick={() => setFitRequest((value) => value + 1)}
              data-testid="cad-fit"
            >
              Fit
            </button>
            <button
              type="button"
              className={classes.tool}
              aria-pressed={wireframe}
              onClick={() => setWireframe(!wireframe)}
              data-testid="cad-wireframe"
            >
              Wireframe
            </button>
            <button
              type="button"
              className={classes.tool}
              aria-pressed={section}
              onClick={() => setSection(!section)}
              data-testid="cad-section"
            >
              Section
            </button>
            {section ? (
              <>
                <select
                  className={classes.axis}
                  value={sectionAxis}
                  onChange={(event) => setSectionAxis(event.target.value as ISectionAxis)}
                  aria-label="Section axis"
                  data-testid="cad-section-axis"
                >
                  <option value="x">X</option>
                  <option value="y">Y</option>
                  <option value="z">Z</option>
                </select>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(sectionFraction * 100)}
                  onChange={(event) => setSectionFraction(Number(event.target.value) / 100)}
                  aria-label="Section position"
                  data-testid="cad-section-position"
                />
              </>
            ) : null}
            <div className="flex" />
            <div className={classes.status} data-testid="cad-status">
              {cadProviderNames.opencascade}
              {model
                ? ` · ${parts.length} ${parts.length === 1 ? 'part' : 'parts'} · ${triangles.toLocaleString()} triangles`
                : ''}
            </div>
          </div>
          <div className={`${classes.canvas} flex rel-box`} data-testid="cad-canvas">
            {model ? (
              <Canvas
                frameloop="demand"
                camera={{ fov: 45, position: [1, 1, 1] }}
                gl={{ antialias: true, preserveDrawingBuffer: true }}
                aria-label={`3D model of ${fileMeta.name || 'the file'}`}
              >
                <Scene
                  model={model}
                  nodesById={scene ? scene.nodesById : noNodes}
                  wireframe={wireframe}
                  section={section}
                  sectionAxis={sectionAxis}
                  sectionFraction={sectionFraction}
                  isolated={isolated}
                  fitRequest={fitRequest}
                />
              </Canvas>
            ) : null}
            <LoadingOverlay show={!model}>Loading 3D model...</LoadingOverlay>
          </div>
        </div>
        {parts.length > 1 ? (
          <div className={classes.parts} data-testid="cad-parts">
            <div className={classes.partsTitle}>Parts</div>
            {parts.map((part) => (
              <button
                type="button"
                key={part.id}
                className={classes.part}
                aria-pressed={isolated === part.id}
                title={`${part.triangles.toLocaleString()} triangles`}
                onClick={() => setIsolated(isolated === part.id ? null : part.id)}
                data-testid="cad-part"
                data-part-id={part.id}
              >
                {part.name}
              </button>
            ))}
          </div>
        ) : null}
        {children}
      </div>
    </CadSceneContext>
  )
}

export default connect(({ auth }: any) => ({ token: auth.authToken }))(PreviewCadOss)
