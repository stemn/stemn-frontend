import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

const systemImport = () => System.import('../PreviewCad/PreviewCad')
export default props => (
  <LoadSplitCode
    cacheKey="PreviewCad"
    systemImport={ systemImport }
    { ...props }
  />
)
