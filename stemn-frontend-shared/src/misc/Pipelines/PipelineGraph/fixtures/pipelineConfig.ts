import { IPipelineConfig } from 'stemn-shared/misc/Pipelines/PipelineGraph/types'

export const pipelineConfigFixture: IPipelineConfig = {
  name: 'Some pipeline',
  steps: {
    some_step: {
      position: {
        x: 50,
        y: 50,
      },
      type: 'some_type',
      ports: {
        in: {
          type: 'input',
        },
        out: {
          type: 'output',
        }
      }
    },
    some_other_step: {
      type: 'some_other_type',
      position: {
        x: 200,
        y: 200,
      },
      ports: {
        in: {
          type: 'input',
        },
        out: {
          type: 'output',
        },
        out2: {
          type: 'output',
        }
      }
    }
  },
  links: [{
    from: 'some_step.ports.out',
    to: 'some_other_step.ports.in',
  }]
}