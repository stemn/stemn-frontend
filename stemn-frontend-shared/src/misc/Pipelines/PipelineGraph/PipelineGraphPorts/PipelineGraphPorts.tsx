import * as React from 'react'
import { PortModel } from 'mrblenny-storm-react-diagrams'
import { PipelineGraphStepModel } from '../PipelineGraphStep'
import { values, pipe, filter, map } from 'ramda'
import { PipelineGraphPort } from '../PipelineGraphPort'
import * as s from './PipelineGraphPorts.scss'

export interface IPipelineGraphPortsProps {
  node: PipelineGraphStepModel,
  type: 'input' | 'output',
  isSelected: boolean,
}

export class PipelineGraphPorts extends React.PureComponent<IPipelineGraphPortsProps> {
  render() {
    const { node, type, isSelected } = this.props
    return (
      <div className={ s.ports }>
        { pipe(
            values,
            filter((port: PortModel) => port.type === type) as any,
            map((port: PortModel) => <PipelineGraphPort key={ port.id } port={ port } node={ node } isSelected={ isSelected } />),
          )(node.ports) 
        }
      </div>
    )
  }
}
