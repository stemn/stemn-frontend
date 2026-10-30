/**
 * The G-code layer viewer (lazy chunk, three.js shared with the CAD viewer): the toolpath the backend's converter made of a
 * G-code render (toolpath.bin), drawn layer by layer in its features' colours, with a layer slider, travel moves on
 * demand and a legend. Picked by PreviewCadSwitch for G-code files.
 */
import * as React from 'react'
import { connect } from 'react-redux'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import { renderModelUrl } from '../PreviewCadOss/PreviewCadOss.utils'
import classes from './PreviewGcode.module.scss'
import { featureColours, featureNames, featuresOf, type IToolpath, loadToolpath, toolpathSummary } from './toolpath'
import { buildToolpathModel, layersBox, type IToolpathModel } from './toolpath.three'
import { ToolpathCanvas } from './ToolpathCanvas'

export interface IPreviewGcodeProps {
  fileMeta: { fileId: string; revisionId: string; name?: string; project: { _id: string } }
  token?: string | null
}

/** The legend: the features the toolpath extrudes, in their colours */
export const ToolpathLegend = ({ toolpath, testId }: { toolpath: IToolpath; testId: string }) => (
  <div className={classes.legend} data-testid={testId}>
    {featuresOf(toolpath).map((feature) => (
      <div key={feature} className={classes.legendRow} data-feature={feature}>
        <span className={classes.swatch} style={{ background: featureColours[feature] }} />
        {featureNames[feature] || feature}
      </div>
    ))}
  </div>
)

export const PreviewGcode = ({ fileMeta, token }: IPreviewGcodeProps) => {
  const [loaded, setLoaded] = React.useState<{ url: string; model?: IToolpathModel; error?: string } | null>(null)
  const [layer, setLayer] = React.useState<number | null>(null)
  const [onlyLayer, setOnlyLayer] = React.useState(false)
  const [showTravel, setShowTravel] = React.useState(false)
  const [fitRequest, setFitRequest] = React.useState(0)

  // a G-code render's default output is its toolpath
  const url = renderModelUrl({
    projectId: fileMeta.project._id,
    fileId: fileMeta.fileId,
    revisionId: fileMeta.revisionId,
  })

  React.useEffect(() => {
    let cancelled = false
    loadToolpath(url, token)
      .then((toolpath) => !cancelled && setLoaded({ url, model: buildToolpathModel(toolpath) }))
      .catch((loadError) => !cancelled && setLoaded({ url, error: loadError.message }))
    return () => {
      cancelled = true
    }
  }, [url, token])

  const current = loaded && loaded.url === url ? loaded : null
  const model = current && current.model ? current.model : null
  const toolpath = model ? model.toolpath : null
  const last = toolpath ? toolpath.layers.length - 1 : 0
  const shown = layer === null ? last : Math.min(layer, last)
  const shownLayer = toolpath ? toolpath.layers[shown] : null

  const models = React.useMemo(() => (model ? [{ side: 'b' as const, model }] : []), [model])
  const lookOf = React.useCallback(
    (_side: string, index: number) => ({ look: !onlyLayer || index === shown ? ('features' as const) : null }),
    [onlyLayer, shown],
  )
  const fitBox = React.useMemo(
    () => (toolpath && shownLayer && onlyLayer ? layersBox(toolpath, [shownLayer]) : null),
    [toolpath, shownLayer, onlyLayer],
  )

  if (current && current.error) {
    return (
      <div className="layout-column layout-align-center-center flex">
        <div className="text-title-5" data-testid="gcode-error">
          {current.error}
        </div>
      </div>
    )
  }

  return (
    <div className={`${classes.viewer} layout-column flex rel-box`} data-testid="gcode-viewer">
      <div className={`${classes.toolbar} layout-row layout-align-start-center`}>
        <button type="button" className={classes.tool} onClick={() => setFitRequest((value) => value + 1)}>
          Fit
        </button>
        <button
          type="button"
          className={classes.tool}
          aria-pressed={showTravel}
          onClick={() => setShowTravel(!showTravel)}
          data-testid="gcode-travel"
        >
          Travel
        </button>
        <button
          type="button"
          className={classes.tool}
          aria-pressed={onlyLayer}
          onClick={() => setOnlyLayer(!onlyLayer)}
          data-testid="gcode-only-layer"
        >
          This layer only
        </button>
        {toolpath && shownLayer ? (
          <label className={classes.slider}>
            <input
              type="range"
              min={0}
              max={last}
              value={shown}
              onChange={(event) => setLayer(Number(event.target.value))}
              aria-label="Layer"
              data-testid="gcode-layer-slider"
            />
            <span data-testid="gcode-layer">
              Layer {shown + 1} of {toolpath.layers.length} · z {shownLayer.z.toFixed(2)} mm
            </span>
          </label>
        ) : null}
        <div className="flex" />
        <div className={classes.status} data-testid="gcode-status">
          {toolpath ? toolpathSummary(toolpath) : 'G-code'}
        </div>
      </div>
      <div className={`${classes.canvas} layout-row flex rel-box`}>
        {toolpath ? (
          <ToolpathCanvas
            models={models}
            lookOf={lookOf}
            maxZ={shownLayer ? shownLayer.z : Infinity}
            showTravel={showTravel}
            fitBox={fitBox}
            fitRequest={fitRequest}
            label={`Toolpath of ${fileMeta.name || 'the file'}`}
            testId="gcode-canvas"
          />
        ) : null}
        {toolpath ? <ToolpathLegend toolpath={toolpath} testId="gcode-legend" /> : null}
        <LoadingOverlay show={!toolpath}>Loading toolpath...</LoadingOverlay>
      </div>
    </div>
  )
}

export default connect(({ auth }: any) => ({ token: auth.authToken }))(PreviewGcode)
