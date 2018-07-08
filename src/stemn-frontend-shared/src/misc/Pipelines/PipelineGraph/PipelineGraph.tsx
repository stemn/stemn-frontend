import * as React from 'react'

export interface IPipelineGraphProps {
  pipeline: object,
  edit: true,
}

export class PipelineGraph extends React.Component {
  render() {
    return (
      <div>
        Pipeline Graph
      </div>
    )
  }
}