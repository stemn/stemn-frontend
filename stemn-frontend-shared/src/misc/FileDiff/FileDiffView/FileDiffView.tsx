/**
 * The diff viewer for 3D CAD (lazy chunk, with three.js and the glTF loader): asks the API for the diff of two
 * revisions (GET /sync/diff, which converts them first if needed), loads both glbs and shows them in the unified view
 * (A and B overlaid, coloured by class) or side by side with synchronised cameras, with class filters, the A -> B slider
 * and an entity panel. Formats the API cannot diff fall back to the caller's plain side-by-side view.
 */
import cn from 'classnames'
import * as React from 'react'
import { connect } from 'react-redux'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import { parseModel } from '../../Files/PreviewFile/PreviewCadOss/PreviewCadOss.model'
import { nodesFromScene, renderModelUrl } from '../../Files/PreviewFile/PreviewCadOss/PreviewCadOss.utils'
import { DiffRequestError, loadDiff } from '../diff.client'
import type { IDiffEntity, IDiffError, IDiffManifest } from '../diff.types'
import {
  applyShortcut,
  classSummary,
  diffClasses,
  diffClassNames,
  diffColours,
  diffShortcuts,
  formatDelta,
  formatValue,
  type IDiffViewState,
  initialViewState,
  panelEntities,
  shortcutFor,
  sideBySideAppearance,
  toggleSwap,
  unifiedAppearance,
} from '../diff.utils'
import { CameraLink } from './cameraLink'
import { DiffCanvas } from './DiffCanvas'
import { type IDiffModel, rememberPlacements } from './diff.scene'
import classes from './FileDiffView.module.scss'

export type IDiffView = 'unified' | 'sideBySide'

interface IDiffFile {
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

type ILoadState =
  | { status: 'loading' | 'pending' }
  | { status: 'ready'; manifest: IDiffManifest; a: IDiffModel; b: IDiffModel; large: boolean }
  | { status: 'unsupported' | 'error'; error: IDiffError }

const EntityDetails = ({
  entity,
  manifest,
  swapped,
  onSwap,
}: {
  entity: IDiffEntity
  manifest: IDiffManifest
  swapped: boolean
  onSwap: () => void
}) => (
  <div className={classes.details} data-testid="diff-entity-details" data-entity-id={entity.id}>
    <div className={classes.detailsTitle}>{entity.label}</div>
    <div className={classes.summary} data-testid="diff-entity-summary">
      <span className={classes.swatch} style={{ background: diffColours[entity.class] }} />
      {classSummary(entity, manifest.units.length)}
    </div>
    {entity.idA && entity.idB && entity.idA !== entity.idB ? (
      <div className={classes.muted}>Renamed from {entity.idA}</div>
    ) : null}
    {entity.match.method && entity.match.method !== 'id' ? (
      <div className={classes.muted}>
        Matched by {entity.match.method === 'instance' ? 'instance' : 'shape and position'}, confidence{' '}
        {Math.round(entity.match.confidence * 100)}%
      </div>
    ) : null}
    {entity.class === 'modified' || entity.class === 'moved' ? (
      <button
        type="button"
        className={classes.tool}
        aria-pressed={swapped}
        onClick={onSwap}
        data-testid="diff-swap"
        title="Swap A and B for this entity (X)"
      >
        {swapped ? 'Showing A solid' : 'Swap A / B'}
      </button>
    ) : null}
    {entity.changes.length ? (
      <table className={classes.deltas} data-testid="diff-deltas">
        <thead>
          <tr>
            <th>Attribute</th>
            <th>A</th>
            <th>B</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {entity.changes.map((change) => (
            <tr key={change.attribute} data-testid="diff-delta" data-attribute={change.attribute}>
              <td>{change.attribute}</td>
              <td>{formatValue(change.a, manifest.units[change.attribute])}</td>
              <td>{formatValue(change.b, manifest.units[change.attribute])}</td>
              <td>{formatDelta(change, manifest.units[change.attribute])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : null}
  </div>
)

const FileDiffContent = ({
  file1,
  file2,
  view: initialView = 'unified',
  token,
  renderFallback,
}: IFileDiffViewProps) => {
  const [load, setLoad] = React.useState<ILoadState>({ status: 'loading' })
  const [view, setView] = React.useState<IDiffView>(initialView)
  const [viewProp, setViewProp] = React.useState<IDiffView>(initialView)
  const [state, setState] = React.useState<IDiffViewState>(initialViewState)
  const [selected, setSelected] = React.useState<string | null>(null)
  const [hovered, setHovered] = React.useState<string | null>(null)
  const [fitRequest, setFitRequest] = React.useState(0)
  const [showHelp, setShowHelp] = React.useState(false)
  const cameraLink = React.useMemo(() => new CameraLink(), [])

  // the compare menu changed the mode: follow it
  if (viewProp !== initialView) {
    setViewProp(initialView)
    setView(initialView)
  }

  const projectId = file1.project._id
  const { fileId } = file1
  const revisionA = file2.revisionId
  const revisionB = file1.revisionId

  React.useEffect(() => {
    const controller = new AbortController()
    const request = { projectId, fileId, revisionA, revisionB, token, roomId: `${fileId}-${revisionA}-${revisionB}` }
    loadDiff(request, { signal: controller.signal, onPending: () => setLoad({ status: 'pending' }) })
      .then(async (manifest) => {
        const url = (revisionId: string) => renderModelUrl({ projectId, fileId, revisionId })
        const [a, b] = await Promise.all([fetchModel(url(revisionA), token), fetchModel(url(revisionB), token)])
        const large = countTriangles(a) + countTriangles(b) > largeModelTriangles
        if (controller.signal.aborted) return
        if (large) setState((current) => ({ ...current, changesOnly: true }))
        setLoad({ status: 'ready', manifest, a, b, large })
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        const diffError: IDiffError =
          error instanceof DiffRequestError ? error.error : { type: 'DIFF_FAILED', message: error.message }
        setLoad({ status: diffError.type === 'DIFF_NOT_SUPPORTED' ? 'unsupported' : 'error', error: diffError })
      })
    return () => controller.abort()
  }, [projectId, fileId, revisionA, revisionB, token])

  const manifest = load.status === 'ready' ? load.manifest : null
  const selectedEntity =
    manifest && selected ? manifest.entities.find((entity) => entity.id === selected) || null : null

  const unifiedFor = React.useCallback((entity: IDiffEntity) => unifiedAppearance(entity, state), [state])
  const sideBySideFor = React.useCallback((entity: IDiffEntity) => sideBySideAppearance(entity, state), [state])

  const select = React.useCallback((id: string | null) => {
    setSelected(id)
    if (id) setFitRequest((value) => value + 1)
  }, [])

  // keyboard shortcuts while the diff view is open (diff.utils diffShortcuts)
  React.useEffect(() => {
    if (!manifest) return
    const onKey = (event: KeyboardEvent) => {
      const shortcut = shortcutFor(event)
      if (!shortcut) return
      event.preventDefault()
      if (shortcut.type === 'view') setView(shortcut.view)
      else if (shortcut.type === 'fit') setFitRequest((value) => value + 1)
      else if (shortcut.type === 'clear') setSelected(null)
      else if (shortcut.type === 'swap') {
        if (selected) setState((current) => toggleSwap(current, selected))
      } else setState((current) => applyShortcut(current, shortcut))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [manifest, selected])

  if (load.status === 'unsupported') {
    return (
      <div className="layout-column flex" data-testid="diff-unsupported">
        <div className={classes.notice}>
          Unified diffs need an open format (STEP, IGES, BREP, STL, OBJ, PLY or 3MF) converted by the open-source CAD
          provider. These revisions are compared side by side.{' '}
          <span className={classes.muted}>{load.error.message}</span>
        </div>
        {renderFallback ? renderFallback() : null}
      </div>
    )
  }

  if (load.status === 'error') {
    return (
      <div className="layout-column layout-align-center-center flex" data-testid="diff-error">
        <div className="text-title-5">{load.error.message}</div>
      </div>
    )
  }

  if (load.status !== 'ready' || !manifest) {
    return (
      <div
        className="layout-column flex rel-box"
        data-testid={load.status === 'pending' ? 'diff-pending' : 'diff-loading'}
      >
        <LoadingOverlay show>
          {load.status === 'pending' ? 'Converting the revisions for the diff...' : 'Loading the diff...'}
        </LoadingOverlay>
      </div>
    )
  }

  const rows = panelEntities(manifest.entities, state.filters)
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
        <div className={`${classes.toolbar} layout-row layout-align-start-center`}>
          <div className={classes.segmented} role="group" aria-label="Diff view">
            <button
              type="button"
              className={classes.tool}
              aria-pressed={view === 'unified'}
              onClick={() => setView('unified')}
              data-testid="diff-view-unified"
              title="Unified view (U)"
            >
              Unified
            </button>
            <button
              type="button"
              className={classes.tool}
              aria-pressed={view === 'sideBySide'}
              onClick={() => setView('sideBySide')}
              data-testid="diff-view-side-by-side"
              title="Side by side (S)"
            >
              Side by side
            </button>
          </div>
          {diffClasses.map((diffClass, index) => (
            <button
              type="button"
              key={diffClass}
              className={cn(classes.tool, classes.filter)}
              aria-pressed={state.filters[diffClass]}
              onClick={() => setState((current) => applyShortcut(current, { type: 'filter', diffClass }))}
              data-testid={`diff-filter-${diffClass}`}
              title={`${diffClassNames[diffClass]} (${index + 1})`}
            >
              <span className={classes.swatch} style={{ background: diffColours[diffClass] }} />
              {diffClassNames[diffClass]}
              <span className={classes.count} data-testid={`diff-count-${diffClass}`}>
                {manifest.counts[diffClass]}
              </span>
            </button>
          ))}
          <label className={classes.check} title="Hide unchanged geometry (C)">
            <input
              type="checkbox"
              checked={state.changesOnly}
              onChange={() => setState((current) => applyShortcut(current, { type: 'changesOnly' }))}
              data-testid="diff-changes-only"
            />
            Changes only
          </label>
          {view === 'unified' ? (
            <label className={classes.slider} title="Crossfade A to B ([ and ], A and B)">
              A
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(state.blend * 100)}
                onChange={(event) => setState((current) => ({ ...current, blend: Number(event.target.value) / 100 }))}
                aria-label="A to B"
                data-testid="diff-slider"
              />
              B
            </label>
          ) : null}
          <div className="flex" />
          <button
            type="button"
            className={classes.tool}
            onClick={() => setFitRequest((value) => value + 1)}
            data-testid="diff-fit"
            title="Fit (F)"
          >
            Fit
          </button>
          <button
            type="button"
            className={classes.tool}
            aria-pressed={showHelp}
            onClick={() => setShowHelp(!showHelp)}
            data-testid="diff-help"
            title="Keyboard shortcuts"
          >
            ?
          </button>
        </div>
        {load.large ? (
          <div className={classes.notice} data-testid="diff-large">
            Large model: unchanged geometry is hidden to keep the view responsive (press C to show it).
          </div>
        ) : null}
        {showHelp ? (
          <table className={classes.help} data-testid="diff-shortcuts">
            <tbody>
              {diffShortcuts.map((shortcut) => (
                <tr key={shortcut.keys}>
                  <td>
                    <kbd>{shortcut.keys}</kbd>
                  </td>
                  <td>{shortcut.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        <div className={`${classes.canvas} layout-row flex rel-box`}>
          {view === 'unified' ? (
            <DiffCanvas
              {...canvasProps}
              modelA={load.a}
              modelB={load.b}
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
                  modelA={load.a}
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
                  modelB={load.b}
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
      <div className={classes.panel} data-testid="diff-panel">
        <div className={classes.panelTitle}>
          {manifest.entities.length} {manifest.entities.length === 1 ? 'entity' : 'entities'}
        </div>
        <div className={classes.rows}>
          {rows.map((entity) => (
            <button
              type="button"
              key={entity.id}
              className={classes.row}
              aria-pressed={selected === entity.id}
              onClick={() => select(selected === entity.id ? null : entity.id)}
              onMouseEnter={() => setHovered(entity.id)}
              onMouseLeave={() => setHovered(null)}
              data-testid="diff-entity"
              data-entity-id={entity.id}
              data-class={entity.class}
              title={entity.id}
            >
              <span className={classes.swatch} style={{ background: diffColours[entity.class] }} />
              <span className="flex text-ellipsis">{entity.label}</span>
              <span className={classes.muted}>{diffClassNames[entity.class]}</span>
            </button>
          ))}
          {rows.length === 0 ? <div className={classes.empty}>No entities in the selected classes.</div> : null}
        </div>
        {selectedEntity ? (
          <EntityDetails
            entity={selectedEntity}
            manifest={manifest}
            swapped={state.swapped.has(selectedEntity.id)}
            onSwap={() => setState((current) => toggleSwap(current, selectedEntity.id))}
          />
        ) : null}
      </div>
    </div>
  )
}

/** A new diff (other file or revisions) starts from a clean state: loading, nothing selected, default filters */
export const FileDiffView = (props: IFileDiffViewProps) => (
  <FileDiffContent key={`${props.file1.fileId}-${props.file2.revisionId}-${props.file1.revisionId}`} {...props} />
)

export default connect(({ auth }: any) => ({ token: auth.authToken }))(FileDiffView)
