import React from 'react';
import styles from './PreviewImage.css';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import ScrollZoom from 'app/shared/modules/Scroll/ScrollZoom/ScrollZoom.jsx'

export default React.createClass({
  getInitialState () {
    return {
      loading: true,
      scale: 1,
      naturalWidth: 0,
      naturalHeight: 0,
    }
  },
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  onMount(nextProps, prevProps) {
    // If the previewId changes, download a new file
    if(!prevProps
       || nextProps.project._id !== prevProps.project._id
       || nextProps.fileMeta.revisionId !== prevProps.fileMeta.revisionId
       || nextProps.fileMeta.fileId !== prevProps.fileMeta.fileId){
      this.setState({
        loading: true,
      })
    }
  },

  onLoad() {
    const [ containerWidth, containerHeight ] = [ this.refs.container.offsetWidth, this.refs.container.offsetHeight] ;
    const { naturalWidth, naturalHeight } = this.refs.image;
    const widthScale = (containerWidth / naturalWidth) * 0.9;
    const heightScale = (containerHeight / naturalHeight) * 0.9;
    const scale = widthScale < heightScale ? widthScale : heightScale;
    this.setState({
      loading: false,
      naturalWidth,
      naturalHeight,
      scale: scale > 1 ? 1 : scale
    })
  },
  zoom (direction) {
    let newValue = 0;
    if(direction == 'in'){
      newValue = Math.round( (this.state.scale * 1.1) * 100) / 100;
    }
    else{
      newValue = Math.round( (this.state.scale * 0.9) * 100) / 100;
      newValue = newValue > 0 ? newValue : this.state.scale;
    }
    this.setState({scale: newValue})
  },
  render() {
    const { fileMeta, project } = this.props;
    const { scale, naturalWidth, naturalHeight } = this.state;
    const fileUrl = `${process.env.API_SERVER}/api/v1/remote/download/${project._id}/${fileMeta.fileId}?revisionId=${fileMeta.revisionId}`;

    const sizeStyles = {
      width: naturalWidth * scale,
      height: naturalHeight * scale,
    };

    return (
      <div ref="container" className={styles.container + ' flex rel-box'}>
        <ScrollZoom zoomIn={() => this.zoom('in')} zoomOut={() => this.zoom('out')} style={{display: 'table', width: '100%', height: '100%'}}>
          <div style={{display: 'table-cell', textAlign: 'center', verticalAlign: 'middle'}}>
            <img src={fileUrl}
              ref="image"
              className={styles.image}
              onLoad={this.onLoad}
              style={sizeStyles}
            />
          </div>
        </ScrollZoom>
        <LoadingOverlay show={this.state.loading} />
      </div>
    )
  }
});
