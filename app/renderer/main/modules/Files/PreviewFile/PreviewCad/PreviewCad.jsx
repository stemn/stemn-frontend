import React from 'react';
import Promise from 'es6-promise'

import previewCadUtils from './PreviewCad.utils.js';

import AutodeskViewer from './AutodeskViewer/AutodeskViewer';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import modelLocked    from 'app/renderer/assets/images/pure-vectors/model-locked.svg';
import modelGear      from 'app/renderer/assets/images/pure-vectors/model-gear.svg';

export default React.createClass({
  checkStatusInterval: null,
  getInitialState () {
    return {
      status: 'pending',
      urn: '',
      token: '',
    }
  },
    // Mounting
  onMount (nextProps, prevProps) {
    if(!prevProps || nextProps.fileMeta != prevProps.fileMeta){
      this.init(nextProps);
    }
  },
  componentDidMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},

  componentWillUnmount(){
    clearInterval(this.checkStatusInterval);
  },
  init(props){
    const { fileMeta } = props;

    this.setState({status: 'pending'})
    clearInterval(this.checkStatusInterval); // Clear interval if we re-init

    if(previewCadUtils.isWebGlSupported()){
      Promise.all([
        previewCadUtils.render({
          projectId  : fileMeta.project._id,
          fileId     : fileMeta.fileId,
          revisionId : fileMeta.revisionId,
          provider   : fileMeta.provider,
        }),
        previewCadUtils.authenticate()
      ]).then(response => {
        // Apply to state
        this.setState({urn: response[0].data.urn64, token: response[1].data.token});

        // Begin to check status
        this.checkStatusInterval = setInterval(this.checkStatus, 700);
      }).catch(error => console.log(error))
    }
    else{
      this.setState({status:'disabled'});
    }
  },
  checkStatus(){
    previewCadUtils.getViewStatus(this.state.urn).then((response) =>{
      this.setState({status: response.data.status})
      if(this.state.status == 'success'){
        clearInterval(this.checkStatusInterval)
      }
      else if(this.state.status == 'failed'){
        clearInterval(this.checkStatusInterval)
      }
    }).catch((error)=>{
      clearInterval(this.checkStatusInterval)
      this.setState({status: 'failed'})
    })
  },
  render() {
    const { status, token, urn } = this.state;
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
    else if(status == 'disabled'){
      return (
        <div className="layout-column layout-align-center-center flex text-center">
          <img style={{width: '100px'}} src={modelLocked}/>
          <div className="text-title-4" style={{marginBottom: '10px'}}>WebGl is disabled or not supported.</div>
          <div className="text-title-5">Visit <a className="link-primary" href="http://get.webgl.org/" target="_blank">webgl.org</a> for more.</div>
        </div>
      )    }
    else if(status == 'pending') {
      return <div className="rel-box flex"><LoadingOverlay show={true}>Processing File...</LoadingOverlay></div>
    }
    else{
      return null
    }
  }
})
