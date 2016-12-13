import React from 'react';
import styles from './PreviewImage.css';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import ScrollZoom from 'app/shared/modules/Scroll/ScrollZoom/ScrollZoom.jsx';
import { getDownloadUrl } from '../../Files.utils.js';

export const Image = React.createClass({
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  onMount(nextProps, prevProps) {
    // If the fileData has changed
    if(nextProps.arrayBuffer){
      if(!prevProps || nextProps.arrayBuffer != prevProps.arrayBuffer){
        const arrayBuffer = nextProps.arrayBuffer;
        const u8          = new Uint8Array(arrayBuffer);
        const b64encoded  = btoa(String.fromCharCode.apply(null, u8));
        const mimetype    = "image/png"; // or whatever your image mime type is
        const b64src      = "data:"+mimetype+";base64,"+b64encoded;
        this.setState({src: b64src})
      }

    }
  },
  render() {
    const { src } = this.state;
    return (
      <img src={src}/>
    )
  }
});

export default React.createClass({
  getInitialState () {
    return {
//      loading: true,
      scale: 1,
      naturalWidth: 0,
      naturalHeight: 0,
    }
  },
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  onMount(nextProps, prevProps) {
    // If the previewId changes, download a new file
    if(!prevProps || nextProps.previewId !== prevProps.previewId){
      // If we don't already have the file, get it
      if(!nextProps.fileData){
        nextProps.downloadFn({
          projectId    : nextProps.fileMeta.project._id,
          fileId       : nextProps.fileMeta.fileId,
          revisionId   : nextProps.fileMeta.revisionId,
          provider     : nextProps.fileMeta.provider,
          responseType : 'arraybuffer'
        })
      }
    }
  },
//  onLoad() {
//    const [ containerWidth, containerHeight ] = [ this.refs.container.offsetWidth, this.refs.container.offsetHeight] ;
//    const { naturalWidth, naturalHeight } = this.refs.image;
//    const widthScale = (containerWidth / naturalWidth) * 0.9;
//    const heightScale = (containerHeight / naturalHeight) * 0.9;
//    const scale = widthScale < heightScale ? widthScale : heightScale;
//    this.setState({
//      loading: false,
//      naturalWidth,
//      naturalHeight,
//      scale: scale > 1 ? 1 : scale
//    })
//  },
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
    const { fileMeta, fileData } = this.props;
    const { scale, naturalWidth, naturalHeight } = this.state;
    const sizeStyles = {
      width: naturalWidth * scale,
      height: naturalHeight * scale,
    };

    return (
      <div ref="container" className={styles.container + ' flex rel-box'}>
        <ScrollZoom zoomIn={() => this.zoom('in')} zoomOut={() => this.zoom('out')} style={{display: 'table', width: '100%', height: '100%'}}>
          <div style={{display: 'table-cell', textAlign: 'center', verticalAlign: 'middle'}}>
            <Image arrayBuffer={fileData && fileData.data && fileData.data.data ? fileData.data.data : []}/>
          </div>
        </ScrollZoom>
        <LoadingOverlay show={this.state.loading} />
      </div>
    )
  }
});


//            <img src={getDownloadUrl(fileMeta)}
//              ref="image"
//              className={styles.image}
//              onLoad={this.onLoad}
//              style={sizeStyles}
//            />
