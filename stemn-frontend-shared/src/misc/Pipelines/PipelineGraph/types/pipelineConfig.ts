/**
 * Triggers
 * - chron
 * - file revision
 * - file commit
 * - webhook
 *
 * Conditions
 * - and
 * - throttle
 * - file
 * - email confirm
 * - slack confirm
 * - file changed
 *
 * Actions
 * - send email
 * - send slack notification
 * - convert file
 * - http request
 * - render file
 * - 3d print model
 * - cad query
 * - publish pdf
 * - run docker container with command
 * - upload revision
 */

export interface IPipelineConfigStepPort {
  type: string,
  value?: any,
}
export interface IPipelineConfigStepBase {
  /**
   * Step Type
   * This should check out the catalogue of steps to find out what to use here
   */
  type: string,
  /**
   * Generic step configuration
   */
  config?: {
    [key: string]: string,
  },
  /**
   * Command to run in the docker container
   */
  command?: string | string[],
  /**
   * Ports
   * This describes the values of the possible input/output ports
   */
  ports: {
    [portId: string]: IPipelineConfigStepPort,
  },
  /**
   * Files
   * File Glob selectors for files which will be accessible in this step
   */
  files?: string | string[],
  /**
   * X-Y Position
   * The x-y position of the step relative to the top left corner. Display purposes only.
   */
  position: {
    x: number,
    y: number,
  },
  /**
   * Allow Failure
   * If true, this step can fail and the pipeline will not cancel. The next step will be run.
   */
  allowFailure?: boolean,
}

export interface IPipelineConfigLink {
  /**
   * From port
   * Links must go from an output port to an input port
   * @pattern: .*?\.ports\..*
   */
  from: string
  /**
   * To port
   * @pattern: .*?\.ports\..*
   */
  to: string
}

export interface IPipelineConfig {
  name: string,
  steps: {
    [id: string]: IPipelineConfigStepBase,
  },
  links: IPipelineConfigLink[],
}

export interface IStep {
  type: string,
  name: string,
  category: string,
  icon: any,
}
