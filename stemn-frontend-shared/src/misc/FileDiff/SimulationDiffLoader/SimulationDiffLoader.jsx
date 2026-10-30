import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

// the simulation diff viewer and vtk.js are only downloaded when a diff of simulation results is opened
const systemImport = () => import('../SimulationDiffView/SimulationDiffView')

const SimulationDiffLoader = (props) => (
  <LoadSplitCode cacheKey="SimulationDiffView" systemImport={systemImport} {...props} />
)

export default SimulationDiffLoader
