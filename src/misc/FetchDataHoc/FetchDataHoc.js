import React, { Component } from 'react';
import { get } from 'lodash';

const simpleCompare = () => {
  
}

const fetchDataHoc = (configs) => (WrappedComponent) => {
  return class fetchData extends Component {
    componentDidMount() {
      this.mount(this.props, {}, true);
    }
    componentWillReceiveProps(nextProps) {
      this.mount(nextProps, this.props, false);
    }
    determineHasChanged = (nextProps, prevProps, firstRun, config) => {
      if (firstRun) {
        // If it is first run, it has changed
        return true
      } else if (typeof config.hasChanged === 'string') {
        // If it is a string, we do a simple compare
        return get(nextProps, config.hasChanged) !== get(prevProps, config.hasChanged)
      }
      else {
        // Else, we run the function
        return config.hasChanged(nextProps, prevProps); 
      }
    }
    mount = (nextProps, prevProps, firstRun) => {
      const processConfig = (config) => {
        const hasChanged = this.determineHasChanged(nextProps, prevProps, firstRun, config);
        if (hasChanged) {
          config.onChange(nextProps);
        }
      };
      configs.forEach(processConfig);
    }
    render() {
      return (
        <WrappedComponent { ...this.props } />
      )
    }
  };
}

export default fetchDataHoc;