import * as React from 'react'
import type { IIfcPanelProps } from './IfcPanel'

// the IFC property panel is its own chunk, only downloaded when an IFC model is shown
const IfcPanel = React.lazy(() => import('./IfcPanel'))

export const IfcPanelLoader = (props: IIfcPanelProps) => (
  <React.Suspense fallback={null}>
    <IfcPanel {...props} />
  </React.Suspense>
)

export default IfcPanelLoader
