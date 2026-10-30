/**
 * The diff viewer for PCB and electronics files (lazy chunk): the API's `pcb` adapter diffs the revisions entity by
 * entity (footprints by uuid, nets, zones, schematic symbols and wires, Gerber components and shapes, drill holes), and
 * the PCB converter's layered SVG of each revision is drawn by the shared 2D viewer.
 */
import { connect } from 'react-redux'
import { pcbOutputUrl } from '../../Files/PreviewFile/PreviewPcb/pcb.utils'
import { type ISvg2dDiffViewProps, Svg2dDiffView } from '../Svg2dDiffView/Svg2dDiffView'

export const PcbDiffView = (props: Omit<ISvg2dDiffViewProps, 'drawingUrl' | 'unsupportedNotice'>) => (
  <Svg2dDiffView
    {...props}
    drawingUrl={pcbOutputUrl}
    unsupportedNotice="Unified diffs of boards need KiCad, Eagle, Gerber or Excellon files."
  />
)

export default connect(({ auth }: any) => ({ token: auth.authToken }))(PcbDiffView)
