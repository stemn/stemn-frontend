import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

const systemImport = () => import('../PreviewPdf/PreviewPdf')
export default props => (
  <LoadSplitCode
    cacheKey="PreviewPdf"
    systemImport={ systemImport }
    { ...props }
  />
)
