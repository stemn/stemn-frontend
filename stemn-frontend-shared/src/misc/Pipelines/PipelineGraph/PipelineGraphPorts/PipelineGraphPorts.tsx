import * as cn from 'classnames'
import { PortModel } from 'mrblenny-storm-react-diagrams'
import { filter, map, pipe, values } from 'ramda'
import * as React from 'react'
import { PipelineGraphPort } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphPort'
import { PipelineGraphStepModel } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphStep'
import * as s from './PipelineGraphPorts.scss'

export interface IPipelineGraphPortsProps {
  node: PipelineGraphStepModel,
  type: 'input' | 'output',
  isSelected: boolean,
}

export class PipelineGraphPorts extends React.PureComponent<IPipelineGraphPortsProps> {
  public render () {
    const { node, type, isSelected } = this.props
    return (
      <div className={cn(s.ports, type === 'output' ? s.end : '')}>
        { pipe(
            values,
            filter((port: PortModel) => port.type === type) as any,
            map((port: PortModel) => <PipelineGraphPort key={port.id} port={port} node={node} isSelected={isSelected} />),
          )(node.ports)
        }
      </div>
    )
  }
}
