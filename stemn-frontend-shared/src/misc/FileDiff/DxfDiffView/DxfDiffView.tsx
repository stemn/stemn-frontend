/**
 * The diff viewer for 2D drawings, DXF and DWG (lazy chunk): the API's `dxf` adapter diffs the revisions entity by
 * entity (handles), and the converter's SVG of each revision is drawn by the shared 2D viewer.
 */
import { connect } from 'react-redux'
import { renderFileUrl } from '../../Files/PreviewFile/PreviewCadOss/renderFormats'
import { type ISvg2dDiffViewProps, Svg2dDiffView } from '../Svg2dDiffView/Svg2dDiffView'

const drawingUrl = (file: { projectId: string; fileId: string; revisionId: string }) =>
  renderFileUrl(file, 'drawing.svg')

export const DxfDiffView = (props: Omit<ISvg2dDiffViewProps, 'drawingUrl' | 'unsupportedNotice'>) => (
  <Svg2dDiffView
    {...props}
    drawingUrl={drawingUrl}
    unsupportedNotice="Unified diffs of drawings need DXF or DWG files converted by the open-source CAD provider."
  />
)

export default connect(({ auth }: any) => ({ token: auth.authToken }))(DxfDiffView)
