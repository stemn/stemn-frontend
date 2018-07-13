import { AbstractNodeFactory, DiagramEngine } from 'mrblenny-storm-react-diagrams'
import * as React from 'react'
import { PipelineGraphStep, PipelineGraphStepModel } from './'

export class PipelineGraphStepFactory extends AbstractNodeFactory {
  constructor (nodeType: string) {
    super(nodeType)
  }

  public generateReactWidget (diagramEngine: DiagramEngine, node: PipelineGraphStepModel) {
    return <PipelineGraphStep node={ node } />
  }

  public getNewInstance () {
    return new PipelineGraphStepModel('trigger')
  }
}
