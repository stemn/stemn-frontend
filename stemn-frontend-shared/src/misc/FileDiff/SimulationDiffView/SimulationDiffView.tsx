/**
 * The diff viewer for simulation results (lazy chunk, with vtk.js; never three.js): asks the API for the diff of two
 * revisions, loads both revisions' block surfaces and shows them unified or side by side with the shared diff toolbar,
 * filters, entity panel and shortcuts. On top of the diff classes it colours blocks by a field of A or B, or by B - A
 * (the field delta mode: the API's delta arrays on blocks whose cells are the same in A and B), with a diverging colour
 * map, auto symmetric or hand-set range, invert, and a legend. Blocks meshed again keep their class colours, and the
 * panel says why.
 */
import * as React from 'react'
import { connect } from 'react-redux'
import { diffColours, panelEntities, sideBySideAppearance } from '../diff.utils'
import type { IDiffEntity, IDiffFieldEntity, IDiffManifest } from '../diff.types'
import { DiffEntityPanel } from '../FileDiffView/DiffEntityPanel'
import { DiffLoadStatus } from '../FileDiffView/DiffLoadStatus'
import { DiffShortcutsHelp, DiffToolbar } from '../FileDiffView/DiffToolbar'
import classes from '../FileDiffView/FileDiffView.module.scss'
import { useDiffLoad } from '../FileDiffView/useDiffLoad'
import { type IDiffView, useDiffViewState } from '../FileDiffView/useDiffViewState'
import { SimulationCanvas } from '../../Files/PreviewFile/PreviewSimulation/SimulationCanvas'
import { ColourLegend, SimulationControls } from '../../Files/PreviewFile/PreviewSimulation/SimulationControls'
import simulationClasses from '../../Files/PreviewFile/PreviewSimulation/PreviewSimulation.module.scss'
import { SimulationDeltas, SimulationRevision } from '../../Files/PreviewFile/PreviewSimulation/simulation.client'
import type { ISimulationGeometry } from '../../Files/PreviewFile/PreviewSimulation/simulation.types'
import {
  colourValues,
  comparable,
  displayValues,
  fieldDeltaSummary,
  finiteRange,
  type IFieldView,
  initialFieldView,
  type ISimulationCopy,
  simulationAppearance,
  symmetricRange,
} from '../../Files/PreviewFile/PreviewSimulation/simulation.utils'
import {
  type IDrawable,
  type ILine,
  SimulationCameraLink,
} from '../../Files/PreviewFile/PreviewSimulation/simulation.vtk'

interface IDiffFile {
  fileId: string
  revisionId: string
  name?: string
  project: { _id: string }
}

export interface ISimulationDiffViewProps {
  /** The newer revision (B) */
  file1: IDiffFile
  /** The older revision (A) */
  file2: IDiffFile
  view?: IDiffView
  token?: string | null
  renderFallback?: () => React.ReactNode
}

interface IRenders {
  a: SimulationRevision
  b: SimulationRevision
  deltas: SimulationDeltas
  geometriesA: Map<number, ISimulationGeometry>
  geometriesB: Map<number, ISimulationGeometry>
}

const blocksOf = (entities: IDiffEntity[], side: 'payloadRefA' | 'payloadRefB') =>
  Array.from(
    new Set(
      entities
        .map((entity) => entity[side])
        .filter(Boolean)
        .map((ref) => ref!.block as number),
    ),
  )

const loadGeometries = async (revision: SimulationRevision, blocks: number[]) =>
  new Map(await Promise.all(blocks.map(async (block) => [block, await revision.geometry(block)] as const)))

/** The field's index among a block's fields, or -1 */
const fieldIndex = (ref: IDiffEntity['payloadRefA'], name: string) =>
  ref ? (ref.fields as Array<{ name: string }>).findIndex((field) => field.name === name) : -1

/** What the panel says about an entity's fields */
const FieldDetails = ({ entity, fieldEntity }: { entity: IDiffEntity; fieldEntity?: IDiffFieldEntity }) => {
  if (!fieldEntity) return null
  return (
    <div className={simulationClasses.fieldDetails} data-testid="simulation-field-details">
      <div data-testid="simulation-topology" data-topology={fieldEntity.topology}>
        {fieldEntity.topology === 'same'
          ? 'Same cells in A and B: the fields are compared value by value.'
          : `${entity.label} was meshed again: its fields are compared by range only, and Δ is not drawn on it.`}
      </div>
      {fieldEntity.deltas.map((delta) => (
        <div key={delta.field} data-testid="simulation-field-delta" data-field={delta.field}>
          <strong>Δ {delta.field}</strong> {fieldDeltaSummary(delta.delta, delta.association)}
        </div>
      ))}
      {fieldEntity.topology === 'same' ? (
        <div className={simulationClasses.muted}>
          {fieldEntity.deltas.length ? 'The other fields did not change.' : 'No field changed.'}
        </div>
      ) : null}
    </div>
  )
}

const SimulationDiffContent = ({
  file1,
  file2,
  view: initialView = 'unified',
  token,
  renderFallback,
}: ISimulationDiffViewProps) => {
  const projectId = file1.project._id
  const { fileId } = file1
  const revisionA = file2.revisionId
  const revisionB = file1.revisionId

  const loadRenders = React.useCallback(
    async (manifest: IDiffManifest, signal: AbortSignal): Promise<IRenders> => {
      const a = new SimulationRevision({ projectId, fileId, revisionId: revisionA }, token, signal)
      const b = new SimulationRevision({ projectId, fileId, revisionId: revisionB }, token, signal)
      const deltas = new SimulationDeltas({ projectId, fileId, revisionA, revisionB }, token, signal)
      const [geometriesA, geometriesB] = await Promise.all([
        loadGeometries(a, blocksOf(manifest.entities, 'payloadRefA')),
        loadGeometries(b, blocksOf(manifest.entities, 'payloadRefB')),
      ])
      return { a, b, deltas, geometriesA, geometriesB }
    },
    [projectId, fileId, revisionA, revisionB, token],
  )

  const load = useDiffLoad<IRenders>({ projectId, fileId, revisionA, revisionB, token, loadRenders })
  const ready = load.status === 'ready' ? load : null
  const manifest = ready ? ready.manifest : null
  const diffView = useDiffViewState({ initialView, active: Boolean(ready) })
  const { view, setView, state, setState, selected, select, setHovered, fitRequest, requestFit, showHelp } = diffView
  const fields = React.useMemo(() => (manifest && manifest.fields ? manifest.fields.fields : []), [manifest])
  const [fieldView, setFieldView] = React.useState<IFieldView>(() => initialFieldView())
  const [arrays, setArrays] = React.useState<Map<string, Float32Array>>(() => new Map())
  const cameraLink = React.useMemo(() => (view === 'sideBySide' ? new SimulationCameraLink() : undefined), [view])

  const field = fields.find((candidate) => candidate.name === fieldView.field) || null
  const fieldEntities = React.useMemo(() => (manifest && manifest.fields ? manifest.fields.entities : {}), [manifest])

  // the arrays the colours need: the field in both revisions (one range for A and B), or B - A
  React.useEffect(() => {
    if (!ready || !field || fieldView.mode === 'classes') return
    let cancelled = false
    const wanted: Array<Promise<[string, Float32Array | null]>> = []
    ready.manifest.entities.forEach((entity) => {
      if (fieldView.mode === 'delta') {
        const fieldEntity = fieldEntities[entity.id]
        const delta = fieldEntity && fieldEntity.deltas.find((candidate) => candidate.field === field.name)
        if (comparable(entity, fieldEntity) && delta) {
          wanted.push(ready.deltas.get(delta.path).then((values) => [`d:${entity.id}`, values]))
        }
        return
      }
      ;(['a', 'b'] as const).forEach((side) => {
        const ref = side === 'a' ? entity.payloadRefA : entity.payloadRefB
        const index = fieldIndex(ref, field.name)
        if (ref && index >= 0) {
          const revision = side === 'a' ? ready.a : ready.b
          wanted.push(revision.field(ref.block, index).then((values) => [`${side}:${entity.id}`, values]))
        }
      })
    })
    Promise.all(wanted).then(
      (entries) => {
        if (!cancelled)
          setArrays(new Map(entries.filter((entry): entry is [string, Float32Array] => Boolean(entry[1]))))
      },
      () => {
        if (!cancelled) setArrays(new Map())
      },
    )
    return () => {
      cancelled = true
    }
  }, [ready, field, fieldView.mode, fieldEntities])

  // one number per point or cell, and the range the colours span
  const displays = React.useMemo(() => {
    const result = new Map<string, Float32Array>()
    if (!field) return result
    arrays.forEach((values, key) =>
      result.set(
        key,
        displayValues({
          values,
          components: field.components,
          component: fieldView.component,
          delta: key.startsWith('d:'),
        }),
      ),
    )
    return result
  }, [arrays, field, fieldView.component])

  const delta = fieldView.mode === 'delta'
  const range = React.useMemo<[number, number]>(() => {
    if (!fieldView.auto) return delta ? [-fieldView.limit, fieldView.limit] : [fieldView.min, fieldView.max]
    const shown = Array.from(displays.entries())
      .filter(([key]) => (delta ? key.startsWith('d:') : !key.startsWith('d:')))
      .map(([, values]) => values)
    return delta ? symmetricRange(shown) : finiteRange(shown) || [0, 1]
  }, [displays, delta, fieldView.auto, fieldView.limit, fieldView.min, fieldView.max])
  const map = delta ? 'diverging' : 'sequential'

  const colours = React.useCallback(
    (key: string, entity: IDiffEntity, copy: ISimulationCopy) => {
      if (!field || !copy.colourBy) return null
      let values = displays.get(copy.colourBy === 'delta' ? `d:${entity.id}` : key)
      // a block whose cells are the same in A and B and whose field did not change: B - A is zero everywhere
      if (!values && copy.colourBy === 'delta' && entity.payloadRefB) {
        const surface = entity.payloadRefB.surface as { points: number; cells: number }
        values = new Float32Array(field.association === 'point' ? surface.points : surface.cells)
      }
      return values ? { association: field.association, rgb: colourValues(values, range, map, fieldView.invert) } : null
    },
    [field, displays, range, map, fieldView.invert],
  )

  const drawablesFor = React.useCallback(
    (
      appearanceOf: (entity: IDiffEntity) => { a: ISimulationCopy | null; b: ISimulationCopy | null },
      sides: Array<'a' | 'b'>,
    ) => {
      if (!ready) return [] as IDrawable[]
      const drawables: IDrawable[] = []
      ready.manifest.entities.forEach((entity) => {
        const appearance = appearanceOf(entity)
        sides.forEach((side) => {
          const copy = appearance[side]
          const ref = side === 'a' ? entity.payloadRefA : entity.payloadRefB
          const geometry = ref && (side === 'a' ? ready.geometriesA : ready.geometriesB).get(ref.block)
          if (!copy || !geometry) return
          const key = `${side}:${entity.id}`
          // the slider moves B from A's placement to its own
          const offset =
            side === 'b' && copy.placement !== undefined && entity.centreA && entity.centreB
              ? entity.centreA.map((value, axis) => (1 - copy.placement!) * (value - entity.centreB![axis]))
              : undefined
          drawables.push({
            key,
            entityId: entity.id,
            geometry,
            colour: copy.colour,
            opacity: copy.opacity,
            offset,
            colours: colours(key, entity, copy),
            edges: selected === entity.id,
          })
        })
      })
      return drawables
    },
    [ready, colours, selected],
  )

  const fieldMode = fieldView.mode !== 'classes' && Boolean(field)

  const unifiedDrawables = React.useMemo(
    () =>
      drawablesFor(
        (entity) =>
          simulationAppearance(entity, state, fieldMode ? fieldView.mode : 'classes', fieldEntities[entity.id]),
        ['a', 'b'],
      ),
    [drawablesFor, state, fieldMode, fieldView.mode, fieldEntities],
  )

  // side by side: A on the left, B on the right; a field mode colours each side by its own field (B - A on the right)
  const sideDrawables = React.useCallback(
    (side: 'a' | 'b') =>
      drawablesFor(
        (entity) => {
          if (!fieldMode) {
            const { a, b } = sideBySideAppearance(entity, state)
            return { a, b }
          }
          const own = simulationAppearance(entity, state, side, fieldEntities[entity.id])
          if (side === 'b' && fieldView.mode === 'delta') {
            return simulationAppearance(entity, state, 'delta', fieldEntities[entity.id])
          }
          return own
        },
        [side],
      ),
    [drawablesFor, fieldMode, state, fieldEntities, fieldView.mode],
  )
  const leftDrawables = React.useMemo(() => (view === 'sideBySide' ? sideDrawables('a') : []), [view, sideDrawables])
  const rightDrawables = React.useMemo(() => (view === 'sideBySide' ? sideDrawables('b') : []), [view, sideDrawables])

  const lines = React.useMemo<ILine[]>(() => {
    if (!manifest || fieldMode) return []
    return manifest.entities
      .filter((entity) => entity.centreA && entity.centreB && simulationAppearance(entity, state, 'classes').line)
      .map((entity) => ({
        key: `line:${entity.id}`,
        from: entity.centreA!,
        to: entity.centreB!,
        colour: diffColours.moved,
      }))
  }, [manifest, fieldMode, state])

  if (!ready || !manifest) {
    return (
      <DiffLoadStatus
        load={load as Exclude<typeof load, { status: 'ready' }>}
        unsupportedNotice="Unified diffs of simulation results need VTK legacy, VTK XML or VTKHDF files."
        renderFallback={renderFallback}
      />
    )
  }

  const remeshed = manifest.entities.filter((entity) => {
    const fieldEntity = fieldEntities[entity.id]
    return fieldEntity && fieldEntity.topology === 'different'
  })
  const comparableCount = manifest.entities.filter((entity) => comparable(entity, fieldEntities[entity.id])).length
  const legendTitle = field
    ? delta
      ? `Δ ${field.name} (B − A)`
      : `${field.name} in ${view === 'sideBySide' ? 'A and B' : fieldView.mode.toUpperCase()}`
    : ''
  const legend = fieldMode ? (
    <ColourLegend title={legendTitle} range={range} map={map} invert={fieldView.invert} signed={delta} />
  ) : null
  const canvasProps = {
    lines,
    clip: fieldView.clip,
    fitRequest,
    fitEntities: selected ? [selected] : undefined,
    onPick: (id: string | null) => select(id),
  }

  return (
    <div
      className={`${classes.view} layout-row flex`}
      data-testid="diff-view"
      data-view={view}
      data-colour-mode={fieldView.mode}
    >
      <div className="layout-column flex rel-box">
        <DiffToolbar
          view={view}
          onView={setView}
          state={state}
          setState={setState}
          counts={manifest.counts}
          onFit={requestFit}
          showHelp={showHelp}
          onToggleHelp={() => diffView.setShowHelp(!showHelp)}
        >
          {fields.length ? (
            <SimulationControls
              value={fieldView}
              onChange={(change) => setFieldView((current) => ({ ...current, ...change }))}
              fields={fields}
              modes={['classes', 'a', 'b', 'delta']}
              range={fieldMode ? range : null}
            />
          ) : null}
        </DiffToolbar>
        {showHelp ? <DiffShortcutsHelp /> : null}
        {delta && field && comparableCount === 0 ? (
          <div className={classes.notice} data-testid="simulation-no-comparable">
            No block has the same cells in A and B, so B − A cannot be drawn: the blocks show their diff classes.
          </div>
        ) : null}
        <div className={`${classes.canvas} layout-row flex rel-box`}>
          {view === 'unified' ? (
            <SimulationCanvas
              {...canvasProps}
              drawables={unifiedDrawables}
              label={`Unified diff of ${file1.name || 'the file'}`}
              testId="diff-canvas"
            >
              {legend}
            </SimulationCanvas>
          ) : (
            <>
              <div className={`${classes.pane} layout-column flex`}>
                <div className={classes.paneTitle}>A · older revision</div>
                <SimulationCanvas
                  {...canvasProps}
                  drawables={leftDrawables}
                  lines={[]}
                  cameraLink={cameraLink}
                  primary
                  label={`Revision A of ${file1.name || 'the file'}`}
                  testId="diff-canvas-a"
                />
              </div>
              <div className={`${classes.pane} layout-column flex`}>
                <div className={classes.paneTitle}>B · newer revision</div>
                <SimulationCanvas
                  {...canvasProps}
                  drawables={rightDrawables}
                  lines={[]}
                  cameraLink={cameraLink}
                  primary={false}
                  label={`Revision B of ${file1.name || 'the file'}`}
                  testId="diff-canvas-b"
                >
                  {legend}
                </SimulationCanvas>
              </div>
            </>
          )}
        </div>
      </div>
      <DiffEntityPanel
        manifest={manifest}
        rows={panelEntities(manifest.entities, state.filters)}
        selected={selected}
        onSelect={select}
        onHover={setHovered}
        swapped={state.swapped}
        onSwap={diffView.swap}
        details={(entity) => <FieldDetails entity={entity} fieldEntity={fieldEntities[entity.id]} />}
      >
        {delta && remeshed.length ? (
          <div className={classes.notice} data-testid="simulation-topology-notice">
            {remeshed.length === 1 ? `${remeshed[0].label} was` : `${remeshed.length} blocks were`} meshed again: Δ is
            not drawn on {remeshed.length === 1 ? 'it' : 'them'}, which keep their diff classes.
          </div>
        ) : null}
      </DiffEntityPanel>
    </div>
  )
}

/** A new diff (other file or revisions) starts from a clean state */
export const SimulationDiffView = (props: ISimulationDiffViewProps) => (
  <SimulationDiffContent key={`${props.file1.fileId}-${props.file2.revisionId}-${props.file1.revisionId}`} {...props} />
)

export default connect(({ auth }: any) => ({ token: auth.authToken }))(SimulationDiffView)
