import { AbstractPortFactory, PortModel } from 'mrblenny-storm-react-diagrams'

export class PipelineGraphPortFactory extends AbstractPortFactory {
  public cb: (initialConfig?: any) => PortModel

  constructor (type: string, cb: (initialConfig?: any) => PortModel) {
    super(type)
    this.cb = cb
  }

  public getNewInstance (initialConfig?: any): PortModel {
    return this.cb(initialConfig)
  }
}
