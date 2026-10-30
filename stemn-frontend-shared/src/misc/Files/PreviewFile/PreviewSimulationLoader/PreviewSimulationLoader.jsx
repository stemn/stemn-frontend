import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

// vtk.js is only downloaded when a simulation result (a vtk render) is shown
const systemImport = () => import('../PreviewSimulation/PreviewSimulation')

const PreviewSimulationLoader = (props) => (
  <LoadSplitCode cacheKey="PreviewSimulation" systemImport={systemImport} {...props} />
)

export default PreviewSimulationLoader
