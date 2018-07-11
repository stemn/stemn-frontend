import * as React from 'react'
import * as s from './PipelineGraphPort.scss'
import { PortWidget } from 'mrblenny-storm-react-diagrams'
import { PortModel } from 'mrblenny-storm-react-diagrams'
import { PipelineGraphStepModel } from '../PipelineGraphStep'

export interface IPipelineGraphPortProps {
  node: PipelineGraphStepModel,
  port: PortModel,
}

export class PipelineGraphPort extends React.PureComponent<IPipelineGraphPortProps> {
  render() {
    const { node, port } = this.props
    return (
      <PortWidget 
        className={ s.port }
        name={ port.name } 
        node={ node } 
        extraProps={ { 
          title: 'some title',
          children: '',
        } }
      />
    )
  }
}
