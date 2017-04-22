import React, { Component, PropTypes } from 'react'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';

export default class PreviewCadLoader extends Component {
  static propTypes = {
    loadCode: PropTypes.func.isRequired,
    systemImport: PropTypes.func.isRequired,
    cacheKey: PropTypes.string.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
    }
  }
  componentWillMount() {
    const { loadCode, systemImport, cacheKey } = this.props
    const wrappedSystemImport = systemImport().then((response) => {
        this.LoadedComponent = response.default
        this.setState({
          loaded: true,
        })
      });

    loadCode(wrappedSystemImport, cacheKey)
  }
  render() {
    const { loadCode, cacheKey, systemImport, ...otherProps } = this.props
    const { loaded } = this.state
    return (
      <div className="layout-column flex">
        { loaded
        ? <this.LoadedComponent { ...otherProps } />
        : null }
        <LoadingOverlay show={ !loaded } />
      </div>
    )
  }
}
