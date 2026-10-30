/**
 * The diff viewer for G-code (lazy chunk): the API's `gcode` adapter diffs the revisions layer by layer, and the
 * converter's toolpath of each revision is drawn by the G-code viewer's ToolpathDiff, with the toolbar, shortcuts and
 * entity panel every diff viewer shares.
 */
import * as React from 'react'
import { connect } from 'react-redux'
import { renderFileUrl } from '../../Files/PreviewFile/PreviewCadOss/renderFormats'
import { type IToolpath, loadToolpath } from '../../Files/PreviewFile/PreviewGcode/toolpath'
import { ToolpathDiff } from '../../Files/PreviewFile/PreviewGcode/ToolpathDiff'
import { panelEntities } from '../diff.utils'
import { CameraLink } from '../FileDiffView/cameraLink'
import { DiffEntityPanel } from '../FileDiffView/DiffEntityPanel'
import { DiffLoadStatus } from '../FileDiffView/DiffLoadStatus'
import { DiffShortcutsHelp, DiffToolbar } from '../FileDiffView/DiffToolbar'
import type { IFileDiffViewProps } from '../FileDiffView/FileDiffView'
import classes from '../FileDiffView/FileDiffView.module.scss'
import { useDiffLoad } from '../FileDiffView/useDiffLoad'
import { useDiffViewState } from '../FileDiffView/useDiffViewState'

const GcodeDiffContent = ({
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

  const load = useDiffLoad<{ toolpaths: { a: IToolpath; b: IToolpath } }>({
    projectId,
    fileId,
    revisionA,
    revisionB,
    token,
    loadRenders: async () => {
      const url = (revisionId: string) => renderFileUrl({ projectId, fileId, revisionId }, 'toolpath.bin')
      const [a, b] = await Promise.all([loadToolpath(url(revisionA), token), loadToolpath(url(revisionB), token)])
      return { toolpaths: { a, b } }
    },
  })

  const manifest = load.status === 'ready' ? load.manifest : null
  const controller = useDiffViewState({ initialView, active: Boolean(manifest) })
  const { view, setView, state, setState, selected, select, setHovered, fitRequest, requestFit } = controller

  if (load.status !== 'ready' || !manifest) {
    return (
      <DiffLoadStatus
        load={load.status === 'ready' ? { status: 'loading' } : load}
        unsupportedNotice="Unified diffs of G-code need a deployment that converts with the open-source CAD provider."
        renderFallback={renderFallback}
      />
    )
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
        {controller.showHelp ? <DiffShortcutsHelp /> : null}
        <div className={`${classes.canvas} layout-row flex rel-box`}>
          <ToolpathDiff
            manifest={manifest}
            a={load.toolpaths.a}
            b={load.toolpaths.b}
            view={view}
            state={state}
            selected={selected}
            onPick={select}
            fitRequest={fitRequest}
            cameraLink={cameraLink}
            fileName={file1.name}
          />
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

/** A new diff (other file or revisions) starts from a clean state: loading, nothing selected, default filters */
export const GcodeDiffView = (props: IFileDiffViewProps) => (
  <GcodeDiffContent key={`${props.file1.fileId}-${props.file2.revisionId}-${props.file1.revisionId}`} {...props} />
)

export default connect(({ auth }: any) => ({ token: auth.authToken }))(GcodeDiffView)
