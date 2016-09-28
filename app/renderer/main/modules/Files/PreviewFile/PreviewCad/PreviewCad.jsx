import React from 'react';
import _ from 'lodash';
import Promise from 'es6-promise'

import previewCadUtils from './previewCadUtils.js';

import AutodeskViewer from './AutodeskViewer/AutodeskViewer';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';

import styles from './PreviewCad.css';

export default React.createClass({
  getInitialState () {
    return {
      status: 'pending',
    }
  },
  componentDidMount() {
    this.init();
  },
  componentWillUnmount(){
    clearInterval(this.checkStatusInterval);
  },
  init(){
    if(previewCadUtils.isWebGlSupported()){
      Promise.all([
        previewCadUtils.render({
          projectId  : this.props.file.project._id,
          fileId     : this.props.file.fileId,
          revisionId : this.props.file.revisionId,
        }),
        previewCadUtils.authenticate()
      ]).then((response)=>{

        // Apply to state
        this.setState({
          urn: response[0].data.urn,
          token: response[1].data.token,
        });

        // Begin to check status
        this.checkStatusInterval = setInterval(this.checkStatus, 700);
      })
    }
    else{
      this.setState({status:'disabled'});
    }
  },
  checkStatus(){
    previewCadUtils.getViewStatus(this.state.urn).then((response) =>{
      this.setState({
        status: response.data.status
      })
      if(this.state.status == 'success'){
        clearInterval(this.checkStatusInterval)
      }
      else if(this.state.status == 'failed'){
        clearInterval(this.checkStatusInterval)
      }
    }).catch((error)=>{
      this.setState({
        status: 'failed'
      })
      clearInterval(this.checkStatusInterval)
    })
  },
  render() {
    if(this.state.status == 'success'){
      return <div className={styles.container}><AutodeskViewer urn={this.state.urn} token={this.state.token} /></div>
    }
    else if(this.state.status == 'failed'){
      return <div className="layout-column layout-align-center-center flex"><div className="text-center text-title-4">Failed</div></div>
    }
    else if(this.state.status == 'disabled'){
      return <div className="layout-column layout-align-center-center flex"><div className="text-center text-title-4">Disabled</div></div>
    }
    else {
      return <div className="rel-box flex"><LoadingOverlay>Processing File...</LoadingOverlay></div>
    }
  }
})
