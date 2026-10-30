/**
 * The diff viewer for 2D drawings (lazy chunk, no three.js): any file type whose converter writes an SVG per revision
 * with an element per entity (`data-entity-id`, the manifest's payloadRef.svg) and a group per layer (`data-layer`).
 * It asks the API for the diff, downloads both SVGs and shows them overlaid (unified view) or in two panes with one
 * shared view (side by side), with the same toolbar, filters, slider, entity panel and shortcuts as the 3D viewer, and
 * layer toggles. The file type's wrapper (DxfDiffView, PcbDiffView) only says where the SVGs are.
 */
import * as React from 'react'
import type { IDiffEntity } from '../diff.types'
import { panelEntities, sideBySideAppearance, unifiedAppearance } from '../diff.utils'
import { DiffEntityPanel } from '../FileDiffView/DiffEntityPanel'
import { DiffLoadStatus } from '../FileDiffView/DiffLoadStatus'
import { DiffShortcutsHelp, DiffToolbar } from '../FileDiffView/DiffToolbar'
import type { IDiffFile } from '../FileDiffView/FileDiffView'
import fileDiffClasses from '../FileDiffView/FileDiffView.module.scss'
import { useDiffLoad } from '../FileDiffView/useDiffLoad'
import { type IDiffView, useDiffViewState } from '../FileDiffView/useDiffViewState'
import { LayerToggles } from './LayerToggles'
import { SvgDiffCanvas } from './SvgDiffCanvas'
import type { IViewBox } from './svg2d.utils'
import { fetchDrawing, initiallyHidden, svgLayers, toggled } from './svgDocument'

export interface ISvg2dDiffViewProps {
  /** The newer revision (B) */
  file1: IDiffFile
  /** The older revision (A) */
  file2: IDiffFile
  view?: IDiffView
  token?: string | null
  /** The plain side-by-side comparison, for files the API cannot diff */
  renderFallback?: () => React.ReactNode
  /** Where a revision's SVG is */
  drawingUrl: (file: { projectId: string; fileId: string; revisionId: string }) => string
  /** What the notice above the fallback says can be diffed */
  unsupportedNotice: string
}

const Svg2dDiffContent = ({
  file1,
  file2,
  view: initialView = 'unified',
  token,
  renderFallback,
  drawingUrl,
  unsupportedNotice,
}: ISvg2dDiffViewProps) => {
  const projectId = file1.project._id
  const { fileId } = file1
  const revisionA = file2.revisionId
  const revisionB = file1.revisionId
  const [viewBox, setViewBox] = React.useState<IViewBox | null>(null)
  const [hiddenLayers, setHiddenLayers] = React.useState<Set<string>>(() => new Set())

  const load = useDiffLoad<{ a: SVGSVGElement; b: SVGSVGElement }>({
    projectId,
    fileId,
    revisionA,
    revisionB,
    token,
    loadRenders: async (_manifest, signal) => {
      const url = (revisionId: string) => drawingUrl({ projectId, fileId, revisionId })
      const [a, b] = await Promise.all([
        fetchDrawing(url(revisionA), token, signal),
        fetchDrawing(url(revisionB), token, signal),
      ])
      setHiddenLayers(initiallyHidden(svgLayers([b, a])))
      return { a, b }
    },
  })

  const manifest = load.status === 'ready' ? load.manifest : null
  const drawings = load.status === 'ready' ? load : null
  const controller = useDiffViewState({ initialView, active: Boolean(manifest) })
  const { view, setView, state, setState, selected, select, hovered, setHovered, fitRequest, requestFit } = controller
  const layers = React.useMemo(() => (drawings ? svgLayers([drawings.b, drawings.a]) : []), [drawings])

  const unifiedFor = React.useCallback((entity: IDiffEntity) => unifiedAppearance(entity, state), [state])
  const sideBySideFor = React.useCallback((entity: IDiffEntity) => sideBySideAppearance(entity, state), [state])

  if (load.status !== 'ready' || !manifest || !drawings) {
    return (
      <DiffLoadStatus
        load={load.status === 'ready' ? { status: 'loading' } : load}
        unsupportedNotice={unsupportedNotice}
        renderFallback={renderFallback}
      />
    )
  }

  const canvasProps = {
    entities: manifest.entities,
    selected,
    hovered,
    onPick: select,
    onHover: setHovered,
    fitRequest,
    viewBox,
    onViewBox: setViewBox,
    hiddenLayers,
  }

  return (
    <div className={`${fileDiffClasses.view} layout-row flex`} data-testid="diff-view" data-view={view}>
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
        >
          <LayerToggles
            layers={layers}
            hidden={hiddenLayers}
            onToggle={(id) => setHiddenLayers((current) => toggled(current, id))}
          />
        </DiffToolbar>
        {controller.showHelp ? <DiffShortcutsHelp /> : null}
        <div className={`${fileDiffClasses.canvas} layout-row flex rel-box`}>
          {view === 'unified' ? (
            <SvgDiffCanvas
              {...canvasProps}
              drawingA={drawings.a}
              drawingB={drawings.b}
              appearanceFor={unifiedFor}
              label={`Unified diff of ${file1.name || 'the drawing'}`}
              testId="diff-canvas"
            />
          ) : (
            <>
              <div className={`${fileDiffClasses.pane} layout-column flex`}>
                <div className={fileDiffClasses.paneTitle}>A · older revision</div>
                <SvgDiffCanvas
                  {...canvasProps}
                  drawingA={drawings.a}
                  appearanceFor={sideBySideFor}
                  primary
                  label={`Revision A of ${file1.name || 'the drawing'}`}
                  testId="diff-canvas-a"
                />
              </div>
              <div className={`${fileDiffClasses.pane} layout-column flex`}>
                <div className={fileDiffClasses.paneTitle}>B · newer revision</div>
                <SvgDiffCanvas
                  {...canvasProps}
                  drawingB={drawings.b}
                  appearanceFor={sideBySideFor}
                  primary={false}
                  label={`Revision B of ${file1.name || 'the drawing'}`}
                  testId="diff-canvas-b"
                />
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
        onSwap={controller.swap}
      />
    </div>
  )
}

/** A new diff (other file or revisions) starts from a clean state */
export const Svg2dDiffView = (props: ISvg2dDiffViewProps) => (
  <Svg2dDiffContent key={`${props.file1.fileId}-${props.file2.revisionId}-${props.file1.revisionId}`} {...props} />
)

export default Svg2dDiffView
