import * as cn from 'classnames'
import { PortWidget } from 'mrblenny-storm-react-diagrams'
import { PortModel } from 'mrblenny-storm-react-diagrams'
import * as React from 'react'
import { PipelineGraphStepModel } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphStep'
import * as s from './PipelineGraphPort.scss'

export interface IPipelineGraphPortProps {
  node: PipelineGraphStepModel,
  port: PortModel,
  isSelected: boolean,
}

export class PipelineGraphPort extends React.PureComponent<IPipelineGraphPortProps> {
  public render () {
    const { node, port, isSelected } = this.props
    return (
      <div className={ cn(s.portOuter, port.type === 'input' ? s.input : s.output) }>
        <div className={ s.line } />
        <PortWidget
          className={ cn(s.port, { [s.selected]: isSelected }) }
          name={ port.name }
          node={ node }
          extraProps={ {
            title: 'some title',
            children: '',
          } }
        />
      </div>
    )
  }
}
