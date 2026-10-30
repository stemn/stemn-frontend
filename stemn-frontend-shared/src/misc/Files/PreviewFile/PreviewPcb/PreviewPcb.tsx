/**
 * The PCB and electronics preview (lazy chunk, PreviewPcbLoader): asks the API to render the file with its PCB converter
 * (KiCad boards and schematics, Eagle boards, Gerber layers, Excellon drill files, zips of a Gerber set) and shows the
 * layered SVG drawing on the 2D diff viewer's canvas, with pan, zoom, fit and layer toggles. A folder's Gerber files
 * shown as one board (a Gerber assembly, `fileMeta.parts`) are rendered part by part and drawn together. No three.js.
 */
import * as React from 'react'
import { connect } from 'react-redux'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import diffClasses from '../../../FileDiff/FileDiffView/FileDiffView.module.scss'
import { LayerToggles } from '../../../FileDiff/Svg2dDiffView/LayerToggles'
import { SvgDiffCanvas } from '../../../FileDiff/Svg2dDiffView/SvgDiffCanvas'
import type { IViewBox } from '../../../FileDiff/Svg2dDiffView/svg2d.utils'
import { fetchDrawing, initiallyHidden, svgLayers, toggled } from '../../../FileDiff/Svg2dDiffView/svgDocument'
import { renderFile } from '../../Files.actions'
import type { IFileRender } from '../../Files.reducer'
import { combineDrawings, formatNames } from './pcb.utils'

interface IPcbFile {
  fileId: string
  revisionId: string
  name?: string
  provider?: string
  project?: { _id: string }
  parts?: IPcbFile[]
}

export interface IPreviewPcbProps {
  fileMeta: IPcbFile & { project: { _id: string } }
  fileRenders: Record<string, IFileRender | undefined>
  token?: string | null
  // a thunk, resolved by connect()
  renderFile: (...args: Parameters<typeof renderFile>) => void
}

const noEntities: never[] = []

const cacheKey = (file: IPcbFile) => `${file.fileId}-${file.revisionId}`

export const PreviewPcb = ({ fileMeta, fileRenders, token, renderFile: requestRender }: IPreviewPcbProps) => {
  const files = React.useMemo(() => (fileMeta.parts && fileMeta.parts.length ? fileMeta.parts : [fileMeta]), [fileMeta])
  const renders = files.map((file) => fileRenders[cacheKey(file)])
  const failed = renders.find((fileRender) => fileRender && fileRender.error)
  // the render download route's address of each render (Files.actions renderFileDownloadUrl), once it is complete
  const urls = renders.map((fileRender) => (fileRender && fileRender.data ? `${fileRender.data}/drawing.svg` : ''))
  const urlKey = urls.every(Boolean) ? urls.join(' ') : ''

  const [loaded, setLoaded] = React.useState<{ key: string; drawing?: SVGSVGElement; error?: string } | null>(null)
  const [viewBox, setViewBox] = React.useState<IViewBox | null>(null)
  const [hiddenLayers, setHiddenLayers] = React.useState<Set<string>>(() => new Set())
  const [fitRequest, setFitRequest] = React.useState(0)

  // ask for every render: the API answers from its records when the revision was rendered before
  React.useEffect(() => {
    files.forEach((file) =>
      requestRender({
        projectId: (file.project || fileMeta.project)._id,
        fileId: file.fileId,
        revisionId: file.revisionId,
        provider: file.provider,
        timestamp: '',
      }),
    )
  }, [files, fileMeta, requestRender])

  React.useEffect(() => {
    if (!urlKey) return
    const controller = new AbortController()
    Promise.all(urlKey.split(' ').map((url) => fetchDrawing(url, token, controller.signal)))
      .then((drawings) => {
        const drawing = combineDrawings(drawings)
        setHiddenLayers(initiallyHidden(svgLayers([drawing])))
        setLoaded({ key: urlKey, drawing })
      })
      .catch((error) => !controller.signal.aborted && setLoaded({ key: urlKey, error: error.message }))
    return () => controller.abort()
  }, [urlKey, token])

  // what was loaded for another revision is never shown
  const current = loaded && loaded.key === urlKey ? loaded : null
  const drawing = current && current.drawing ? current.drawing : null
  const layers = React.useMemo(() => (drawing ? svgLayers([drawing]) : []), [drawing])
  const entities = React.useMemo(
    () =>
      drawing
        ? new Set(
            Array.from(drawing.querySelectorAll('[data-entity-id]'), (element) =>
              element.getAttribute('data-entity-id'),
            ),
          ).size
        : 0,
    [drawing],
  )

  const error = failed ? (failed.error as any).message || String(failed.error) : current && current.error
  if (error) {
    return (
      <div className="layout-column layout-align-center-center flex text-center" data-testid="pcb-error">
        <div className="text-title-4" style={{ marginBottom: '10px' }}>
          This file could not be converted for preview.
        </div>
        <div className="text-title-5">{error}</div>
      </div>
    )
  }

  if (!drawing) {
    const progress = renders.map((fileRender) => fileRender && fileRender.status).find(Boolean)
    return (
      <div className="rel-box flex" data-testid="pcb-render-status">
        <LoadingOverlay show>{progress || 'Rendering file...'}</LoadingOverlay>
      </div>
    )
  }

  const format = drawing.getAttribute('data-format') || ''

  return (
    <div className="layout-column flex rel-box" data-testid="pcb-viewer" data-format={format}>
      <div className={`${diffClasses.toolbar} layout-row layout-align-start-center`}>
        <button
          type="button"
          className={diffClasses.tool}
          onClick={() => setFitRequest((value) => value + 1)}
          data-testid="pcb-fit"
        >
          Fit
        </button>
        <LayerToggles
          layers={layers}
          hidden={hiddenLayers}
          onToggle={(id) => setHiddenLayers((hidden) => toggled(hidden, id))}
        />
        <div className="flex" />
        <div className={diffClasses.muted} data-testid="pcb-status">
          {formatNames[format] || format} · {entities} {entities === 1 ? 'entity' : 'entities'} · {layers.length}{' '}
          {layers.length === 1 ? 'layer' : 'layers'}
        </div>
      </div>
      <div className="layout-row flex rel-box">
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
          testId="pcb-canvas"
        />
      </div>
    </div>
  )
}

export default connect(({ auth, files }: any) => ({ token: auth.authToken, fileRenders: files.fileRenders }), {
  renderFile,
})(PreviewPcb)
