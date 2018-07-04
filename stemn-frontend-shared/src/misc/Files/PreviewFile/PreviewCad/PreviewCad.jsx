import React from 'react'

import { isWebGlSupported } from './PreviewCad.utils.js'
import AutodeskLocalViewer from './AutodeskLocalViewer/AutodeskLocalViewer'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import modelLocked from 'stemn-shared/assets/images/pure-vectors/model-locked.svg'


export default class PreviewCad extends React.Component {
  state = {
    status: 'pending',
  };

  onMount = (nextProps, prevProps) => {
    if (!prevProps || nextProps.fileMeta !== prevProps.fileMeta) {
      const {
        renderFn,
      } = nextProps
      this.setState({ status: 'pending' })
      if (isWebGlSupported()) {
        renderFn()
      } else {
        this.setState({ status: 'disabled' })
      }
    }
  };

  componentDidMount() { this.onMount(this.props) }
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props) }

  render() {
    const { fileMeta, fileRender } = this.props
    const { status } = this.state
            
    if (status === 'disabled') {
      return (
        <div className="layout-column layout-align-center-center flex text-center">
          <img style={ { width: '100px' } } src={ modelLocked } />
          <div className="text-title-4" style={ { marginBottom: '10px' } }>WebGl is disabled or not supported.</div>
          <div className="text-title-5">Visit <a className="link-primary" href="http://get.webgl.org/" target="_blank">webgl.org</a> for more.</div>
        </div>
      )
    } else if (fileRender && fileRender.data) {
      return <AutodeskLocalViewer path={ fileRender.data } linkKey={ fileMeta.fileId } />
    } 
    return <div className="rel-box flex"><LoadingOverlay show>{ fileRender && fileRender.status ? fileRender.status : 'Rendering file...' }</LoadingOverlay></div>
  }
}
