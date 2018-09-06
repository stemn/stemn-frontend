import { get } from 'lodash'
import * as React from 'react'

export interface IFetchDataHocConfig {
  hasChanged: string,
  onChange: (props: any) => any,
}

// const filterMountConfig = (config) => config.filter(item => !item.unmount)
const filterUnMountConfig = (config) => config.filter((item) => item.unmount)

const fetchDataHoc = (configs: IFetchDataHocConfig[]) => (WrappedComponent) => class FetchData extends React.Component {
  // Mount
  public componentDidMount () {
    this.mount(this.props, {}, true)
  }
  public componentWillReceiveProps (nextProps) {
    this.mount(nextProps, this.props, false)
  }
  // Unmount
  public componentWillUnmount () {
    // Note, we set firstRun to true because this is the last run so we want to process
    // all unmount events
    filterUnMountConfig(configs).forEach((config) => this.processConfig({}, this.props, true, config))
  }
  // Utils
  public determineHasChanged = (nextProps, prevProps, firstRun, config) => {
    if (firstRun) {
      // If it is first run, it has changed
      return true
    } else if (typeof config.hasChanged === 'string') {
      // If it is a string, we do a simple compare
      return get(nextProps, config.hasChanged) !== get(prevProps, config.hasChanged)
    }

    // Else, we run the function
    return config.hasChanged(nextProps, prevProps)
  }
  public processConfig = (nextProps, prevProps, firstRun, config) => {
    // This will process the config if it has changed
    const hasChanged = this.determineHasChanged(nextProps, prevProps, firstRun, config)
    if (hasChanged) {
      config.onChange(nextProps, prevProps)
    }
  }
  public mount = (nextProps, prevProps, firstRun) => {
    configs.forEach((config) => this.processConfig(nextProps, prevProps, firstRun, config))
  }
  public render () {
      return (
        <WrappedComponent {...this.props} />
      )
    }
}

export default fetchDataHoc
