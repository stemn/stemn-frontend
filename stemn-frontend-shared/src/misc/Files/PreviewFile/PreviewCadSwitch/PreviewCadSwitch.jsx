import React from 'react'

import { isWebGlSupported } from '../PreviewCad/PreviewCad.utils.js'
import { isOpenCascadeRender } from '../PreviewCadOss/PreviewCadOss.utils'
import PreviewCadLoader from '../PreviewCadLoader'
import PreviewCadOssLoader from '../PreviewCadOssLoader'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import modelLocked from 'stemn-shared/assets/images/pure-vectors/model-locked.svg'

/**
 * The CAD preview, independent of the conversion provider: requests the render, shows its progress, and once
 * the render is ready picks the viewer from the render's `cadProvider` (the open-source three.js viewer for
 * 'opencascade', the Autodesk viewer otherwise). The Autodesk viewer's scripts are only loaded for Autodesk renders.
 * Render failures arrive as `fileRender.error` and are shown by PreviewFile.
 */
export default class PreviewCadSwitch extends React.Component {
  state = {
    status: 'pending',
  }

  onMount = (nextProps, prevProps) => {
    if (!prevProps || nextProps.fileMeta !== prevProps.fileMeta) {
      const { renderFn } = nextProps
      this.setState({ status: 'pending' })
      if (isWebGlSupported()) {
        renderFn()
      } else {
        this.setState({ status: 'disabled' })
      }
    }
  }

  componentDidMount() {
    this.onMount(this.props)
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.onMount(nextProps, this.props)
  }

  render() {
    const { fileMeta, fileRender, previewId } = this.props
    const { status } = this.state

    if (status === 'disabled') {
      return (
        <div className="layout-column layout-align-center-center flex text-center">
          <img style={{ width: '100px' }} src={modelLocked} />
          <div className="text-title-4" style={{ marginBottom: '10px' }}>
            WebGl is disabled or not supported.
          </div>
          <div className="text-title-5">
            Visit{' '}
            <a className="link-primary" href="http://get.webgl.org/" target="_blank">
              webgl.org
            </a>{' '}
            for more.
          </div>
        </div>
      )
    } else if (fileRender && fileRender.data) {
      return isOpenCascadeRender(fileRender) ? (
        <PreviewCadOssLoader previewId={previewId} fileMeta={fileMeta} fileRender={fileRender} />
      ) : (
        <PreviewCadLoader previewId={previewId} fileMeta={fileMeta} fileRender={fileRender} />
      )
    }
    return (
      <div className="rel-box flex" data-testid="cad-render-status">
        <LoadingOverlay show>
          {fileRender && fileRender.status ? fileRender.status : 'Rendering file...'}
        </LoadingOverlay>
      </div>
    )
  }
}
