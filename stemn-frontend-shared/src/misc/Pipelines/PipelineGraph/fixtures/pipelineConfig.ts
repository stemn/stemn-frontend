import { IPipelineConfig } from '../types'

export const pipelineConfigFixture: IPipelineConfig = {
  name: 'Some pipeline',
  steps: {
    some_step: {
      type: 'some_type',
      ports: {
        in: ['in'],
        out: ['out'],
      }
    },
    some_other_step: {
      type: 'some_other_type',
      ports: {
        in: ['in'],
        out: ['out'],
      }
    }
  },
  links: [{
    from: 'some_step.ports.out',
    to: 'some_other_step.ports.in',
  }]
}