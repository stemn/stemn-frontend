/**
 * The simulation result viewer (lazy chunk, vtk.js): the blocks of a `vtk` render, coloured by block or by a field (a
 * component or the magnitude) with a legend, an auto or hand-set range, invert, and a clipping plane. Picked by
 * PreviewCadSwitch for renders whose `cadProvider` is 'vtk'.
 */
import * as React from 'react'
import { connect } from 'react-redux'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import classes from './PreviewSimulation.module.scss'
import { SimulationCanvas } from './SimulationCanvas'
import { ColourLegend, SimulationControls } from './SimulationControls'
import { SimulationRevision } from './simulation.client'
import type { ISimulationGeometry, ISimulationScene } from './simulation.types'
import { colourValues, displayValues, finiteRange, type IFieldView, initialFieldView } from './simulation.utils'
import type { IDrawable } from './simulation.vtk'

export interface IPreviewSimulationProps {
  fileMeta: { fileId: string; revisionId: string; name?: string; project: { _id: string } }
  token?: string | null
}

/** Block colours: the palette the converter's thumbnails use */
const palette = ['#b8bdc7', '#6b94c7', '#d98c4d', '#73b380', '#bf80b3', '#ccbf66']

interface ILoaded {
  revision: SimulationRevision
  scene: ISimulationScene
  geometries: Map<number, ISimulationGeometry>
}

const PreviewSimulationContent = ({ fileMeta, token }: IPreviewSimulationProps) => {
  const [loaded, setLoaded] = React.useState<ILoaded | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [fieldView, setFieldView] = React.useState<IFieldView>(() => initialFieldView())
  const [arrays, setArrays] = React.useState<Map<string, Float32Array>>(() => new Map())
  const [fitRequest, setFitRequest] = React.useState(0)

  React.useEffect(() => {
    const controller = new AbortController()
    const revision = new SimulationRevision(
      { projectId: fileMeta.project._id, fileId: fileMeta.fileId, revisionId: fileMeta.revisionId },
      token,
      controller.signal,
    )
    revision
      .scene()
      .then(async (scene) => {
        const blocks = scene.entities.map((entity) => entity.payloadRef.block)
        const geometries = new Map(
          await Promise.all(blocks.map(async (block) => [block, await revision.geometry(block)] as const)),
        )
        if (!controller.signal.aborted) setLoaded({ revision, scene, geometries })
      })
      .catch((reason) => {
        if (!controller.signal.aborted) setError(reason.message)
      })
    return () => controller.abort()
  }, [fileMeta.project._id, fileMeta.fileId, fileMeta.revisionId, token])

  // every field of the blocks, each name once
  const fields = React.useMemo(() => {
    const byName = new Map<string, { name: string; association: 'point' | 'cell'; components: number }>()
    loaded?.scene.entities.forEach((entity) =>
      entity.payloadRef.fields.forEach((field) => {
        if (!byName.has(field.name)) byName.set(field.name, field)
      }),
    )
    return Array.from(byName.values())
  }, [loaded])
  const field = fields.find((candidate) => candidate.name === fieldView.field) || null

  React.useEffect(() => {
    if (!loaded || !field) return
    let cancelled = false
    Promise.all(
      loaded.scene.entities.map(async (entity) => {
        const index = entity.payloadRef.fields.findIndex((candidate) => candidate.name === field.name)
        const values = index >= 0 ? await loaded.revision.field(entity.payloadRef.block, index) : null
        return [entity.id, values] as const
      }),
    ).then((entries) => {
      if (!cancelled) setArrays(new Map(entries.filter((entry): entry is [string, Float32Array] => Boolean(entry[1]))))
    })
    return () => {
      cancelled = true
    }
  }, [loaded, field])

  const displays = React.useMemo(() => {
    const result = new Map<string, Float32Array>()
    if (field) {
      arrays.forEach((values, id) =>
        result.set(id, displayValues({ values, components: field.components, component: fieldView.component })),
      )
    }
    return result
  }, [arrays, field, fieldView.component])

  const range = React.useMemo<[number, number]>(
    () => (fieldView.auto ? finiteRange(Array.from(displays.values())) || [0, 1] : [fieldView.min, fieldView.max]),
    [displays, fieldView.auto, fieldView.min, fieldView.max],
  )

  const drawables = React.useMemo<IDrawable[]>(() => {
    if (!loaded) return []
    return loaded.scene.entities.flatMap((entity, index) => {
      const geometry = loaded.geometries.get(entity.payloadRef.block)
      if (!geometry) return []
      const values = field ? displays.get(entity.id) : null
      return [
        {
          key: entity.id,
          entityId: entity.id,
          geometry,
          colour: palette[index % palette.length],
          opacity: 1,
          colours:
            field && values
              ? { association: field.association, rgb: colourValues(values, range, 'sequential', fieldView.invert) }
              : null,
        },
      ]
    })
  }, [loaded, field, displays, range, fieldView.invert])

  if (error) {
    return (
      <div className="layout-column layout-align-center-center flex" data-testid="simulation-error">
        <div className="text-title-5">{error}</div>
      </div>
    )
  }

  if (!loaded) {
    return (
      <div className="layout-column flex rel-box" data-testid="simulation-loading">
        <LoadingOverlay show>Loading the simulation result...</LoadingOverlay>
      </div>
    )
  }

  const { cells, points } = loaded.scene.entities.reduce(
    (total, entity) => ({
      cells: total.cells + entity.attributes.cells,
      points: total.points + entity.attributes.points,
    }),
    { cells: 0, points: 0 },
  )

  return (
    <div className="layout-column flex" data-testid="simulation-preview">
      <div className={`${classes.toolbar} layout-row layout-align-start-center`}>
        <SimulationControls
          value={fieldView}
          onChange={(change) => setFieldView((current) => ({ ...current, ...change }))}
          fields={fields}
          range={field ? range : null}
        />
        <div className="flex" />
        <span className={classes.muted} data-testid="simulation-summary">
          {loaded.scene.entities.length} {loaded.scene.entities.length === 1 ? 'block' : 'blocks'},{' '}
          {cells.toLocaleString('en')} cells, {points.toLocaleString('en')} points
        </span>
        <button type="button" className={classes.mode} onClick={() => setFitRequest((value) => value + 1)}>
          Fit
        </button>
      </div>
      <div className={`${classes.canvas} layout-column flex rel-box`}>
        <SimulationCanvas
          drawables={drawables}
          clip={fieldView.clip}
          fitRequest={fitRequest}
          label={`Simulation result ${fileMeta.name || ''}`}
          testId="simulation-canvas"
        >
          {field ? (
            <ColourLegend title={field.name} range={range} map="sequential" invert={fieldView.invert} signed={false} />
          ) : null}
        </SimulationCanvas>
      </div>
    </div>
  )
}

/** Another revision starts from a clean state */
export const PreviewSimulation = (props: IPreviewSimulationProps) => (
  <PreviewSimulationContent key={`${props.fileMeta.fileId}-${props.fileMeta.revisionId}`} {...props} />
)

export default connect(({ auth }: any) => ({ token: auth.authToken }))(PreviewSimulation)
