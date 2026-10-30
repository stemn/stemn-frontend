/**
 * The diff viewer for 3D models (lazy chunk, with three.js and the glTF loader): CAD files and IFC models. It asks the
 * API for the diff of two revisions (GET /sync/diff, which converts them first if needed), loads both glbs and shows them
 * in the unified view (A and B overlaid, coloured by class) or side by side with synchronised cameras, with class
 * filters, the A -> B slider and an entity panel. IFC models also get a property panel and a storey filter (a lazy chunk
 * of its own). Formats the API cannot diff fall back to the caller's plain side-by-side view.
 */
import * as React from 'react'
import { connect } from 'react-redux'
import { parseModel } from '../../Files/PreviewFile/PreviewCadOss/PreviewCadOss.model'
import { nodesFromScene, renderModelUrl } from '../../Files/PreviewFile/PreviewCadOss/PreviewCadOss.utils'
import type { IDiffEntity, IDiffManifest } from '../diff.types'
import { panelEntities, sideBySideAppearance, unifiedAppearance } from '../diff.utils'
import { IfcPanelLoader } from '../IfcPanel/IfcPanelLoader'
import { isIfcManifest, storeyOfEntity, storeysOf } from '../IfcPanel/ifc.utils'
import { CameraLink } from './cameraLink'
import { DiffCanvas } from './DiffCanvas'
import { DiffEntityPanel } from './DiffEntityPanel'
import { DiffLoadStatus } from './DiffLoadStatus'
import { DiffShortcutsHelp, DiffToolbar } from './DiffToolbar'
import { type IDiffModel, rememberPlacements } from './diff.scene'
import classes from './FileDiffView.module.scss'
import { useDiffLoad } from './useDiffLoad'
import { type IDiffView, useDiffViewState } from './useDiffViewState'

export type { IDiffView }

export interface IDiffFile {
  fileId: string
  revisionId: string
  name?: string
  project: { _id: string }
}

export interface IFileDiffViewProps {
  /** The newer revision (B) */
  file1: IDiffFile
  /** The older revision (A) */
  file2: IDiffFile
  view?: IDiffView
  token?: string | null
  /** The plain side-by-side comparison, for files the API cannot diff */
  renderFallback?: () => React.ReactNode
}

/** Above this many triangles in A and B together the view starts with "changes only" on */
const largeModelTriangles = 4_000_000

const fetchModel = async (url: string, token?: string | null) => {
  const response = await fetch(url, { headers: token ? { Authorization: `bearer ${token}` } : {} })
  if (!response.ok) throw new Error(`The 3D model could not be downloaded (${response.status}).`)
  const root = await parseModel(await response.arrayBuffer())
  const model: IDiffModel = { root, nodesById: nodesFromScene(root) }
  rememberPlacements(model)
  return model
}

const countTriangles = (model: IDiffModel) => {
  let triangles = 0
  model.root.traverse((object: any) => {
    if (object.isMesh && object.geometry) {
      const { index, attributes } = object.geometry
      triangles += Math.floor((index ? index.count : attributes.position.count) / 3)
    }
  })
  return triangles
}

const hidden = { a: null, b: null, line: false }

const FileDiffContent = ({
  file1,
  file2,
  view: initialView = 'unified',
  token,
  renderFallback,
}: IFileDiffViewProps) => {
  const projectId = file1.project._id
  const { fileId } = file1
  const revisionA = file2.revisionId
  const revisionB = file1.revisionId
  const cameraLink = React.useMemo(() => new CameraLink(), [])
  const [storey, setStorey] = React.useState<string | null>(null)

  const load = useDiffLoad<{ a: IDiffModel; b: IDiffModel; large: boolean }>({
    projectId,
    fileId,
    revisionA,
    revisionB,
    token,
    loadRenders: async () => {
      const url = (revisionId: string) => renderModelUrl({ projectId, fileId, revisionId })
      const [a, b] = await Promise.all([fetchModel(url(revisionA), token), fetchModel(url(revisionB), token)])
      const large = countTriangles(a) + countTriangles(b) > largeModelTriangles
      if (large) controller.setState((current) => ({ ...current, changesOnly: true }))
      return { a, b, large }
    },
  })

  const manifest: IDiffManifest | null = load.status === 'ready' ? load.manifest : null
  const controller = useDiffViewState({ initialView, active: Boolean(manifest) })
  const { view, setView, state, setState, selected, select, hovered, setHovered, fitRequest, requestFit } = controller
  const models = load.status === 'ready' ? load : null

  // ifc models: the storeys, and the storey of every entity for the storey filter
  const ifc = isIfcManifest(manifest)
  const storeys = React.useMemo(() => (ifc && models ? storeysOf([models.a, models.b]) : []), [ifc, models])
  const storeyOf = React.useMemo(() => {
    const byId = new Map<string, string | null>()
    if (ifc && models && manifest) {
      manifest.entities.forEach((entity) => byId.set(entity.id, storeyOfEntity(entity, models.a, models.b)))
    }
    return byId
  }, [ifc, models, manifest])
  const onStorey = React.useCallback(
    (entity: IDiffEntity) => !storey || storeyOf.get(entity.id) === storey,
    [storey, storeyOf],
  )

  // entities on other storeys than the one picked are not drawn
  const unifiedFor = React.useCallback(
    (entity: IDiffEntity) => (onStorey(entity) ? unifiedAppearance(entity, state) : hidden),
    [state, onStorey],
  )
  const sideBySideFor = React.useCallback(
    (entity: IDiffEntity) => (onStorey(entity) ? sideBySideAppearance(entity, state) : hidden),
    [state, onStorey],
  )

  if (load.status !== 'ready' || !manifest || !models) {
    return (
      <DiffLoadStatus
        load={load.status === 'ready' ? { status: 'loading' } : load}
        unsupportedNotice="Unified diffs need an open format (STEP, IGES, BREP, STL, OBJ, PLY, 3MF or IFC) converted by the open-source CAD provider."
        renderFallback={renderFallback}
      />
    )
  }

  const rows = panelEntities(manifest.entities, state.filters).filter(onStorey)
  const selectedEntity = selected ? manifest.entities.find((entity) => entity.id === selected) || null : null
  const canvasProps = {
    entities: manifest.entities,
    selected,
    hovered,
    onPick: select,
    onHover: setHovered,
    fitRequest,
  }

  return (
    <div className={`${classes.view} layout-row flex`} data-testid="diff-view" data-view={view}>
      <div className="layout-column flex rel-box">
        <DiffToolbar
          view={view}
          onView={setView}
          state={state}
          setState={setState}
          counts={manifest.counts}
          onFit={requestFit}
          showHelp={controller.showHelp}
          onToggleHelp={() => controller.setShowHelp(!controller.showHelp)}
        />
        {models.large ? (
          <div className={classes.notice} data-testid="diff-large">
            Large model: unchanged geometry is hidden to keep the view responsive (press C to show it).
          </div>
        ) : null}
        {controller.showHelp ? <DiffShortcutsHelp /> : null}
        <div className={`${classes.canvas} layout-row flex rel-box`}>
          {view === 'unified' ? (
            <DiffCanvas
              {...canvasProps}
              modelA={models.a}
              modelB={models.b}
              appearanceFor={unifiedFor}
              label={`Unified diff of ${file1.name || 'the file'}`}
              testId="diff-canvas"
            />
          ) : (
            <>
              <div className={`${classes.pane} layout-column flex`}>
                <div className={classes.paneTitle}>A · older revision</div>
                <DiffCanvas
                  {...canvasProps}
                  modelA={models.a}
                  appearanceFor={sideBySideFor}
                  cameraLink={cameraLink}
                  primary
                  label={`Revision A of ${file1.name || 'the file'}`}
                  testId="diff-canvas-a"
                />
              </div>
              <div className={`${classes.pane} layout-column flex`}>
                <div className={classes.paneTitle}>B · newer revision</div>
                <DiffCanvas
                  {...canvasProps}
                  modelB={models.b}
                  appearanceFor={sideBySideFor}
                  cameraLink={cameraLink}
                  primary={false}
                  label={`Revision B of ${file1.name || 'the file'}`}
                  testId="diff-canvas-b"
                />
              </div>
            </>
          )}
        </div>
      </div>
      <DiffEntityPanel
        manifest={manifest}
        rows={rows}
        selected={selected}
        onSelect={select}
        onHover={setHovered}
        swapped={state.swapped}
        onSwap={controller.swap}
      >
        {ifc ? (
          <IfcPanelLoader
            node={
              selectedEntity
                ? (selectedEntity.idB && models.b.nodesById.get(selectedEntity.idB)) ||
                  (selectedEntity.idA && models.a.nodesById.get(selectedEntity.idA)) ||
                  null
                : null
            }
            previousNode={
              selectedEntity && selectedEntity.idA && selectedEntity.idB
                ? models.a.nodesById.get(selectedEntity.idA) || null
                : null
            }
            storeys={storeys}
            storey={storey}
            onStorey={setStorey}
          />
        ) : null}
      </DiffEntityPanel>
    </div>
  )
}

/** A new diff (other file or revisions) starts from a clean state: loading, nothing selected, default filters */
export const FileDiffView = (props: IFileDiffViewProps) => (
  <FileDiffContent key={`${props.file1.fileId}-${props.file2.revisionId}-${props.file1.revisionId}`} {...props} />
)

export default connect(({ auth }: any) => ({ token: auth.authToken }))(FileDiffView)
