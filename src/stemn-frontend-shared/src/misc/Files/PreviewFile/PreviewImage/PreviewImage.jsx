import React from 'react'
import styles         from './PreviewImage.css'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import ScrollZoom     from 'stemn-shared/misc/Scroll/ScrollZoom/ScrollZoom.jsx'

export default class PreviewImage extends React.Component {
  state = {
    scale: 1,
    naturalWidth: 0,
    naturalHeight: 0,
  };

  componentWillMount() { this.onMount(this.props) }
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props) }

  onMount = (nextProps, prevProps) => {
    // If the previewId changes, download a new file
    if (!prevProps || nextProps.previewId !== prevProps.previewId) {
      nextProps.downloadFn({
        projectId: nextProps.fileMeta.project._id,
        fileId: nextProps.fileMeta.fileId,
        revisionId: nextProps.fileMeta.revisionId,
        provider: nextProps.fileMeta.provider,
        responseType: 'path',
      })
    }
  };

  onLoad = () => {
    setTimeout(() => {
      const [containerWidth, containerHeight] = [this.refs.container.offsetWidth, this.refs.container.offsetHeight]
      const { naturalWidth, naturalHeight }     = this.refs.image
      const widthScale = (containerWidth / naturalWidth) * 0.9
      const heightScale = (containerHeight / naturalHeight) * 0.9
      const scale = widthScale < heightScale ? widthScale : heightScale
      this.setState({
        scale: scale > 1 ? 1 : scale,
        naturalWidth,
        naturalHeight,
      })
    }, 1)
  };

  zoom = (direction) => {
    let newValue = 0
    if (direction === 'in') {
      newValue = Math.round((this.state.scale * 1.1) * 100) / 100
    } else {
      newValue = Math.round((this.state.scale * 0.9) * 100) / 100
      newValue = newValue > 0 ? newValue : this.state.scale
    }
    this.setState({ scale: newValue })
  };

  render() {
    const {
      fileData,
    } = this.props
    const { scale, naturalWidth, naturalHeight } = this.state
    const sizeStyles = {
      width: naturalWidth  * scale,
      height: naturalHeight * scale,
    }

    const imageUrl  = fileData && fileData.data ? fileData.data : ''
    const isLoading = fileData && fileData.data ? fileData.loading : true

    return (
      <div ref="container" className={ `${styles.container} flex rel-box` }>
        <ScrollZoom zoomIn={ () => this.zoom('in') } zoomOut={ () => this.zoom('out') } style={ { display: 'table', width: '100%', height: '100%' } }>
          <div style={ { display: 'table-cell', textAlign: 'center', verticalAlign: 'middle' } }>
            <img
              src={ imageUrl }
              ref="image"
              className={ styles.image }
              style={ sizeStyles }
              onLoad={ this.onLoad }
            />
          </div>
        </ScrollZoom>
        <LoadingOverlay show={ isLoading } />
      </div>
    )
  }
}
