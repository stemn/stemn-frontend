import React, {PropTypes} from 'react';
import { omit }       from 'lodash';
import styles         from './PreviewImage.css';
import LoadingOverlay from 'stemn-frontend-shared/src/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import ScrollZoom     from 'stemn-frontend-shared/src/misc/Scroll/ScrollZoom/ScrollZoom.jsx';
//import { getDownloadUrl } from 'stemn-frontend-shared/src/misc/Files/utils';
//const ImagePropTypes = {
//  arrayBuffer  : PropTypes.array,   // Image data array buffer
//  onLoad       : PropTypes.func,    // Function to be run on load
//}

// Array Buffer Image
//export const Image = React.createClass({
//  propTypes: ImagePropTypes,
//  getInitialState () {
//    return {
//      src: ''
//    }
//  },
//  componentWillMount() { this.onMount(this.props) },
//  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
//  onMount(nextProps, prevProps) {
//    // If the fileData has changed
//    console.log(nextProps);
//    if(nextProps.arrayBuffer && nextProps.arrayBuffer.length > 0){
//      if(!prevProps || nextProps.arrayBuffer != prevProps.arrayBuffer){
//        const arrayBuffer = nextProps.arrayBuffer;
//        const u8          = new Uint8Array(arrayBuffer);
//        const b64encoded  = btoa(String.fromCharCode.apply(null, u8));
//        const mimetype    = "image/png"; // or whatever your image mime type is
//        const b64src      = "data:"+mimetype+";base64,"+b64encoded;
//        this.setState({src: b64src})
//
//        // Run the load function
//        if(nextProps.onLoad){
//          nextProps.onLoad()
//        }
//      }
//    }
//  },
//  render() {
//    const { src } = this.state;
//    return (
//      <img ref="img" src={src} { ...omit(this.props, Object.keys(ImagePropTypes)) }/>
//    )
//  }
//});

export default React.createClass({
  getInitialState () {
    return {
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
      nextProps.downloadFn({
        projectId    : nextProps.fileMeta.project._id,
        fileId       : nextProps.fileMeta.fileId,
        revisionId   : nextProps.fileMeta.revisionId,
        provider     : nextProps.fileMeta.provider,
        responseType : 'path'
      })
    }
  },
  onLoad() {
    setTimeout(()=>{
      const [ containerWidth, containerHeight ] = [ this.refs.container.offsetWidth, this.refs.container.offsetHeight];
      const { naturalWidth, naturalHeight }     = this.refs.image;
      const widthScale    = (containerWidth / naturalWidth) * 0.9;
      const heightScale   = (containerHeight / naturalHeight) * 0.9;
      const scale = widthScale < heightScale ? widthScale : heightScale;
      this.setState({
        loading       : false,
        scale         : scale > 1 ? 1 : scale,
        naturalWidth  : naturalWidth,
        naturalHeight : naturalHeight
      })
    }, 1)
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
    const { fileMeta, fileData } = this.props;
    const { scale, naturalWidth, naturalHeight } = this.state;
    const sizeStyles = {
      width  : naturalWidth  * scale,
      height : naturalHeight * scale,
    };
    return (
      <div ref="container" className={styles.container + ' flex rel-box'}>
        <ScrollZoom zoomIn={() => this.zoom('in')} zoomOut={() => this.zoom('out')} style={{display: 'table', width: '100%', height: '100%'}}>
          <div style={{display: 'table-cell', textAlign: 'center', verticalAlign: 'middle'}}>
            <img
              src={fileData && fileData.data ? fileData.data : ''}
              ref="image"
              className={styles.image}
              style={sizeStyles}
              onLoad={this.onLoad}
            />
          </div>
        </ScrollZoom>
        <LoadingOverlay show={fileData && fileData.data ? fileData.loading : true} />
      </div>
    )
  }
});
