/**
 * The diff of two revisions of a G-code file (lazy chunk, loaded by FileDiffView for the gcode adapter's manifests): the
 * layers of A and B drawn by the diff viewer's rules (diff.utils) layer by layer, unified or side by side, up to the
 * height of the layer slider, and for the selected modified layer the moves only A extrudes (red) and only B extrudes
 * (green), compared segment by segment in the browser.
 */
import * as React from 'react'
import type { CameraLink } from '../../../FileDiff/FileDiffView/cameraLink'
import type { IDiffEntity, IDiffManifest } from '../../../FileDiff/diff.types'
import {
  diffColours,
  type IDiffAppearance,
  type IDiffViewState,
  sideBySideAppearance,
  unifiedAppearance,
} from '../../../FileDiff/diff.utils'
import classes from './PreviewGcode.module.scss'
import { compareLayers, type IToolpath, layerHeights } from './toolpath'
import { buildToolpathModel, type IToolpathSide, layersBox } from './toolpath.three'
import { type IToolpathOverlay, ToolpathCanvas } from './ToolpathCanvas'

export interface IToolpathDiffProps {
  manifest: IDiffManifest
  a: IToolpath
  b: IToolpath
  view: 'unified' | 'sideBySide'
  state: IDiffViewState
  selected: string | null
  onPick: (id: string | null) => void
  fitRequest: number
  cameraLink: CameraLink
  fileName?: string
}

const layerOf = (entity: IDiffEntity, side: IToolpathSide): number | null => {
  const ref = side === 'a' ? entity.payloadRefA : entity.payloadRefB
  return ref && typeof ref.layer === 'number' ? ref.layer : null
}

export const ToolpathDiff = ({
  manifest,
  a,
  b,
  view,
  state,
  selected,
  onPick,
  fitRequest,
  cameraLink,
  fileName,
}: IToolpathDiffProps) => {
  const [showTravel, setShowTravel] = React.useState(false)
  const heights = React.useMemo(() => layerHeights(a, b), [a, b])
  const [height, setHeight] = React.useState<number | null>(null)
  const shownHeight = height === null ? heights.length - 1 : Math.min(height, heights.length - 1)

  // the models, and the lists the canvases take, made once (a new list would fit the camera again)
  const models = React.useMemo(() => {
    const [modelA, modelB] = [buildToolpathModel(a, 'a'), buildToolpathModel(b, 'b')]
    return {
      unified: [
        { side: 'a' as IToolpathSide, model: modelA },
        { side: 'b' as IToolpathSide, model: modelB },
      ],
      a: [{ side: 'a' as IToolpathSide, model: modelA }],
      b: [{ side: 'b' as IToolpathSide, model: modelB }],
    }
  }, [a, b])

  // the entity of each layer of each side
  const entityOf = React.useMemo(() => {
    const sides: Record<IToolpathSide, Map<number, IDiffEntity>> = { a: new Map(), b: new Map() }
    manifest.entities.forEach((entity) => {
      ;(['a', 'b'] as IToolpathSide[]).forEach((side) => {
        const layer = layerOf(entity, side)
        if (layer !== null) sides[side].set(layer, entity)
      })
    })
    return sides
  }, [manifest])

  const selectedEntity = selected ? manifest.entities.find((entity) => entity.id === selected) || null : null

  // the moves of the selected modified layer only one revision extrudes
  const comparison = React.useMemo(() => {
    if (!selectedEntity || selectedEntity.class !== 'modified') return null
    const [layerA, layerB] = [layerOf(selectedEntity, 'a'), layerOf(selectedEntity, 'b')]
    if (layerA === null || layerB === null) return null
    return {
      layerA,
      layerB,
      ...compareLayers({ toolpath: a, layer: a.layers[layerA] }, { toolpath: b, layer: b.layers[layerB] }),
    }
  }, [selectedEntity, a, b])

  const appearanceOf = React.useCallback(
    (entity: IDiffEntity) =>
      view === 'unified' ? unifiedAppearance(entity, state) : sideBySideAppearance(entity, state),
    [view, state],
  )

  const lookOf = React.useCallback(
    (side: IToolpathSide, index: number) => {
      const entity = entityOf[side].get(index)
      if (!entity) return { look: null }
      const appearance = appearanceOf(entity)
      const look: IDiffAppearance | null = side === 'a' ? appearance.a : appearance.b
      // the A -> B slider moves B from A's placement to its own
      const placement = side === 'b' && look ? look.placement : undefined
      const offset =
        placement !== undefined && entity.move
          ? entity.move.translation.map((value) => -(1 - placement) * value)
          : undefined
      return { look, offset }
    },
    [entityOf, appearanceOf],
  )

  const overlays = React.useMemo((): IToolpathOverlay[] => {
    if (!comparison) return []
    return [
      { side: 'a', layer: comparison.layerA, indexes: comparison.aOnly, colour: diffColours.removed },
      { side: 'b', layer: comparison.layerB, indexes: comparison.bOnly, colour: diffColours.added },
    ]
  }, [comparison])

  const lines = React.useMemo(
    () =>
      view === 'unified'
        ? manifest.entities
            .filter((entity) => entity.centreA && entity.centreB && unifiedAppearance(entity, state).line)
            .map((entity) => ({
              from: entity.centreA as number[],
              to: entity.centreB as number[],
              colour: diffColours[entity.class],
            }))
        : [],
    [manifest, state, view],
  )

  const fitBox = React.useMemo(() => {
    if (!selectedEntity) return null
    const layerB = layerOf(selectedEntity, 'b')
    const layerA = layerOf(selectedEntity, 'a')
    return layerB !== null
      ? layersBox(b, [b.layers[layerB]])
      : layerA !== null
        ? layersBox(a, [a.layers[layerA]])
        : null
  }, [selectedEntity, a, b])

  const pick = React.useCallback(
    (picked: { side: IToolpathSide; layer: number } | null) => {
      const entity = picked ? entityOf[picked.side].get(picked.layer) : null
      onPick(entity ? entity.id : null)
    },
    [entityOf, onPick],
  )

  const canvasProps = {
    lookOf,
    maxZ: heights[shownHeight],
    showTravel,
    overlays,
    fitBox,
    fitRequest,
    onPick: pick,
  }

  return (
    <div className="layout-column flex rel-box" data-testid="gcode-diff">
      <div className={`${classes.toolbar} layout-row layout-align-start-center`}>
        <button
          type="button"
          className={classes.tool}
          aria-pressed={showTravel}
          onClick={() => setShowTravel(!showTravel)}
          data-testid="gcode-diff-travel"
        >
          Travel
        </button>
        <label className={classes.slider}>
          <input
            type="range"
            min={0}
            max={heights.length - 1}
            value={shownHeight}
            onChange={(event) => setHeight(Number(event.target.value))}
            aria-label="Up to layer height"
            data-testid="gcode-diff-layer-slider"
          />
          <span data-testid="gcode-diff-height">Up to z {heights[shownHeight].toFixed(2)} mm</span>
        </label>
      </div>
      <div className="layout-row flex rel-box">
        {view === 'unified' ? (
          <ToolpathCanvas
            {...canvasProps}
            models={models.unified}
            lines={lines}
            label={`Unified diff of ${fileName || 'the file'}`}
            testId="diff-canvas"
          />
        ) : (
          <>
            <div className={`${classes.pane} layout-column flex`}>
              <div className={classes.paneTitle}>A · older revision</div>
              <ToolpathCanvas
                {...canvasProps}
                models={models.a}
                cameraLink={cameraLink}
                primary
                label={`Revision A of ${fileName || 'the file'}`}
                testId="diff-canvas-a"
              />
            </div>
            <div className={`${classes.pane} layout-column flex`}>
              <div className={classes.paneTitle}>B · newer revision</div>
              <ToolpathCanvas
                {...canvasProps}
                models={models.b}
                cameraLink={cameraLink}
                primary={false}
                label={`Revision B of ${fileName || 'the file'}`}
                testId="diff-canvas-b"
              />
            </div>
          </>
        )}
        {comparison && selectedEntity ? (
          <div
            className={classes.comparison}
            data-testid="gcode-diff-comparison"
            data-a-only={comparison.aOnly.length}
            data-b-only={comparison.bOnly.length}
          >
            <div>{selectedEntity.label}</div>
            <div className={classes.legendRow}>
              <span className={classes.swatch} style={{ background: diffColours.removed }} />
              {comparison.aOnly.length} {comparison.aOnly.length === 1 ? 'move' : 'moves'} only in A
            </div>
            <div className={classes.legendRow}>
              <span className={classes.swatch} style={{ background: diffColours.added }} />
              {comparison.bOnly.length} {comparison.bOnly.length === 1 ? 'move' : 'moves'} only in B
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ToolpathDiff
