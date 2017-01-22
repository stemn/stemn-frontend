import React from 'react';
import Promise from 'es6-promise'

import previewCadUtils from './PreviewCad.utils.js';

//import AutodeskViewer from './AutodeskViewer/AutodeskViewer';
import AutodeskLocalViewer from './AutodeskLocalViewer/AutodeskLocalViewer'

import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import modelLocked    from 'stemn-shared/assets/images/pure-vectors/model-locked.svg';
import modelGear      from 'stemn-shared/assets/images/pure-vectors/model-gear.svg';

//export const GetStatusOfUrn =  React.createClass({
//  getInitialState () {
//    return {
//      status: 'pending',
//    }
//  },
//  componentDidMount() {
//    this.checkStatus()
//  },
//  checkStatus(){
//    previewCadUtils.getViewStatus(this.props.urn).then(response => {
//      this.setState({status: response.data.status})
//    }).catch(error=>{
//      this.setState({status: 'failed'})
//    })
//  },
//  render() {
//    const { urn, token } = this.props;
//    const { status } = this.state;
//    if(status == 'success'){
//      return <AutodeskViewer urn={urn} token={token} />
//    }
//    else if(status == 'failed'){
//      return (
//        <div className="layout-column layout-align-center-center flex">
//          <img style={{width: '100px'}} src={modelGear}/>
//          <div className="text-title-4" style={{marginBottom: '10px'}}>Something went wrong.</div>
//          <div className="text-title-5">Your model could not be processed for viewing.</div>
//        </div>
//      )
//    }
//    else{
//      return <div className="rel-box flex"><LoadingOverlay show={true}>Conversion underway...</LoadingOverlay></div>
//    }
//  }
//})

export default React.createClass({
  getInitialState () {
    return {
      status: 'pending'
    }
  },
  onMount (nextProps, prevProps) {
    if(!prevProps || nextProps.fileMeta != prevProps.fileMeta){
      const { fileMeta, fileRender, renderFn } = nextProps;
      this.setState({status: 'pending'})
      if(previewCadUtils.isWebGlSupported()){
        renderFn({
          projectId  : fileMeta.project._id,
          fileId     : fileMeta.fileId,
          revisionId : fileMeta.revisionId,
          provider   : fileMeta.provider,
        });
      }
      else{
        this.setState({status:'disabled'});
      }
    }
  },
  componentDidMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},

  render() {
    const { fileMeta, fileRender } = this.props;
    const { status } = this.state;
    if(fileRender && fileRender.data){
      return <AutodeskLocalViewer path={fileRender.data} linkKey={fileMeta.fileId} />
    }
    else if(status == 'disabled'){
      return (
        <div className="layout-column layout-align-center-center flex text-center">
          <img style={{width: '100px'}} src={modelLocked}/>
          <div className="text-title-4" style={{marginBottom: '10px'}}>WebGl is disabled or not supported.</div>
          <div className="text-title-5">Visit <a className="link-primary" href="http://get.webgl.org/" target="_blank">webgl.org</a> for more.</div>
        </div>
      )
    }
    else{
      return <div className="rel-box flex"><LoadingOverlay show={true}>Rendering file...</LoadingOverlay></div>
    }
  }
})
