import React from 'react';
import Promise from 'es6-promise'

import previewCadUtils from './PreviewCad.utils.js';

import AutodeskViewer from './AutodeskViewer/AutodeskViewer';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import modelLocked    from 'app/renderer/assets/images/pure-vectors/model-locked.svg';
import modelGear      from 'app/renderer/assets/images/pure-vectors/model-gear.svg';
import PreviewExpired from '../PreviewExpired/PreviewExpired.jsx';

export const GetStatusOfUrn =  React.createClass({
  getInitialState () {
    return {
      status: 'pending',
    }
  },
  checkStatusInterval: null,
  componentDidMount() {
    this.checkStatusInterval = setInterval(this.checkStatus, 700);
  },
  componentWillUnmount(){
    clearInterval(this.checkStatusInterval);
  },
  checkStatus(){
    previewCadUtils.getViewStatus(this.props.urn).then(response => {
      this.setState({status: response.data.status})
      if(this.state.status == 'success' || this.state.status == 'failed'){
        clearInterval(this.checkStatusInterval)
      }
    }).catch(error=>{
      clearInterval(this.checkStatusInterval)
      this.setState({status: 'failed'})
    })
  },
  render() {
    const { urn, token } = this.props;
    const { status } = this.state;
    if(status == 'success'){
      return <AutodeskViewer urn={urn} token={token} />
    }
    else if(status == 'failed'){
      return (
        <div className="layout-column layout-align-center-center flex">
          <img style={{width: '100px'}} src={modelGear}/>
          <div className="text-title-4" style={{marginBottom: '10px'}}>Something went wrong.</div>
          <div className="text-title-5">Your model could not be processed for viewing.</div>
        </div>
      )
    }
    else{
      return <div className="rel-box flex"><LoadingOverlay show={true}>Conversion underway...</LoadingOverlay></div>
    }
  }
})

export default React.createClass({
  getInitialState () {
    return {
      status: 'pending',
      token: '',
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
        previewCadUtils.authenticate().then(response => {
          this.setState({token: response.data.token})
        })
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
    const { token, status } = this.state;
    if(fileRender && fileRender.data && fileRender.data.urn64 && token){
      return <GetStatusOfUrn urn={fileRender.data.urn64} token={token}/>
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
    else if(fileRender && fileRender.error){
      if(fileRender.error.type == 'REVISION_NOT_FOUND'){
        return <PreviewExpired provider={fileMeta.provider}/>
      }
      else{
        return (
          <div className="layout-column layout-align-center-center flex">
            <div className="text-title-5">{fileRender.error.message}</div>
          </div>
        )
      }
    }
    else{
      return <div className="rel-box flex"><LoadingOverlay show={true}>Uploading to renderer...</LoadingOverlay></div>
    }
  }
})
