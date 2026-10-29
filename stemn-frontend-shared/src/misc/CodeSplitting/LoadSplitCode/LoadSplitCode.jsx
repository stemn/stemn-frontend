import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import { load } from 'stemn-shared/misc/LazyLoading/LazyLoading.utils'

export default class PreviewCadLoader extends Component {
  static propTypes = {
    systemImport: PropTypes.func, // The actual system.import
    cacheKey: PropTypes.string.isRequired, // The cachekey
    otherModules: PropTypes.array, // This is an array of global modules
    loadCode: PropTypes.func.isRequired, // The loadCode function from the container
  }
  static defaultProps = {
    otherModules: [],
  }
  constructor(props) {
    super(props)
    this.state = {
      mainLoaded: false,
      otherLoaded: false,
    }
  }
  UNSAFE_componentWillMount() {
    const { loadCode, systemImport, otherModules, cacheKey } = this.props
    const wrappedSystemImport = systemImport().then((response) => {
      this.LoadedComponent = response.default
      this.setState({
        mainLoaded: true,
      })
    })

    load(otherModules).then(() => {
      this.setState({
        otherLoaded: true,
      })
    })

    loadCode(wrappedSystemImport, cacheKey)
  }
  render() {
    const { loadCode, cacheKey, systemImport, ...otherProps } = this.props
    const { mainLoaded, otherLoaded } = this.state
    const loaded = mainLoaded && otherLoaded
    const LoadedComponent = this.LoadedComponent
    return (
      <div className="layout-column flex">
        {loaded ? <LoadedComponent {...otherProps} /> : null}
        <LoadingOverlay show={!loaded} />
      </div>
    )
  }
}
