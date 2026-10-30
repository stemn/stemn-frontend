/**
 * The preview of a 2D drawing (lazy chunk, no three.js): the SVG the open-source converter made of a DXF or DWG file,
 * with pan, zoom, fit and layer toggles. The same canvas the 2D diff viewer draws both revisions with.
 */
import * as React from 'react'
import { connect } from 'react-redux'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import diffClasses from '../../../FileDiff/FileDiffView/FileDiffView.module.scss'
import { LayerToggles } from '../../../FileDiff/Svg2dDiffView/LayerToggles'
import { SvgDiffCanvas } from '../../../FileDiff/Svg2dDiffView/SvgDiffCanvas'
import type { IViewBox } from '../../../FileDiff/Svg2dDiffView/svg2d.utils'
import { fetchDrawing, initiallyHidden, svgLayers, toggled } from '../../../FileDiff/Svg2dDiffView/svgDocument'
import { renderFileUrl } from '../PreviewCadOss/renderFormats'

export interface IPreviewDrawingProps {
  fileMeta: { fileId: string; revisionId: string; name?: string; project: { _id: string } }
  token?: string | null
}

const noEntities: never[] = []

export const PreviewDrawing = ({ fileMeta, token }: IPreviewDrawingProps) => {
  const [loaded, setLoaded] = React.useState<{ url: string; drawing?: SVGSVGElement; error?: string } | null>(null)
  const [viewBox, setViewBox] = React.useState<IViewBox | null>(null)
  const [hiddenLayers, setHiddenLayers] = React.useState<Set<string>>(() => new Set())
  const [fitRequest, setFitRequest] = React.useState(0)

  const url = renderFileUrl(
    { projectId: fileMeta.project._id, fileId: fileMeta.fileId, revisionId: fileMeta.revisionId },
    'drawing.svg',
  )

  React.useEffect(() => {
    const controller = new AbortController()
    fetchDrawing(url, token, controller.signal)
      .then((drawing) => {
        setHiddenLayers(initiallyHidden(svgLayers([drawing])))
        setLoaded({ url, drawing })
      })
      .catch((error) => !controller.signal.aborted && setLoaded({ url, error: error.message }))
    return () => controller.abort()
  }, [url, token])

  // what was loaded for another revision is never shown
  const current = loaded && loaded.url === url ? loaded : null
  const drawing = current && current.drawing ? current.drawing : null
  const layers = React.useMemo(() => (drawing ? svgLayers([drawing]) : []), [drawing])
  const entities = React.useMemo(() => (drawing ? drawing.querySelectorAll('[data-entity-id]').length : 0), [drawing])

  if (current && current.error) {
    return (
      <div className="layout-column layout-align-center-center flex">
        <div className="text-title-5" data-testid="drawing-error">
          {current.error}
        </div>
      </div>
    )
  }

  return (
    <div className="layout-column flex rel-box" data-testid="drawing-viewer">
      <div className={`${diffClasses.toolbar} layout-row layout-align-start-center`}>
        <button
          type="button"
          className={diffClasses.tool}
          onClick={() => setFitRequest((value) => value + 1)}
          data-testid="drawing-fit"
        >
          Fit
        </button>
        <LayerToggles
          layers={layers}
          hidden={hiddenLayers}
          onToggle={(id) => setHiddenLayers((hidden) => toggled(hidden, id))}
        />
        <div className="flex" />
        <div className={diffClasses.muted} data-testid="drawing-status">
          {drawing ? `${entities} ${entities === 1 ? 'entity' : 'entities'} · ${layers.length} layers` : ''}
        </div>
      </div>
      <div className="layout-row flex rel-box">
        {drawing ? (
          <SvgDiffCanvas
            drawingB={drawing}
            entities={noEntities}
            selected={null}
            hovered={null}
            onPick={() => {}}
            onHover={() => {}}
            fitRequest={fitRequest}
            viewBox={viewBox}
            onViewBox={setViewBox}
            hiddenLayers={hiddenLayers}
            label={`Drawing of ${fileMeta.name || 'the file'}`}
            testId="drawing-canvas"
          />
        ) : null}
        <LoadingOverlay show={!drawing}>Loading drawing...</LoadingOverlay>
      </div>
    </div>
  )
}

export default connect(({ auth }: any) => ({ token: auth.authToken }))(PreviewDrawing)
