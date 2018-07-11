import * as React from 'react'
import { PortModel } from 'mrblenny-storm-react-diagrams'
import { PipelineGraphStepModel } from '../PipelineGraphStep'
import { values, pipe, filter, map } from 'ramda'
import { PipelineGraphPort } from '../PipelineGraphPort'
import * as s from './PipelineGraphPorts.scss'

export interface IPipelineGraphPortsProps {
  node: PipelineGraphStepModel,
  type: 'input' | 'output',
}

export class PipelineGraphPorts extends React.PureComponent<IPipelineGraphPortsProps> {
  render() {
    const { node, type } = this.props
    return (
      <div className={ s.ports }>
        { pipe(
            values,
            filter((port: PortModel) => port.type === type) as any,
            map((port: PortModel) => <PipelineGraphPort key={ port.id } port={ port } node={ node }/>),
          )(node.ports) 
        }
      </div>
    )
  }
}
