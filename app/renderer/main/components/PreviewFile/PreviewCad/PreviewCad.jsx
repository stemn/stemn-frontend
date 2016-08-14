import React from 'react';
import _ from 'lodash';
import promise from 'bluebird'

import previewCadUtils from './previewCadUtils.js';

import AutodeskViewer from './AutodeskViewer/AutodeskViewer';

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
      promise.all([
        previewCadUtils.render({
          projectStub : this.props.fileMeta.parentProject,
          path        : this.props.fileMeta.path,
          revision    : this.props.fileMeta.rev,
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
    })
  },
  render() {
    if(this.state.status == 'success'){
      return <AutodeskViewer urn={this.state.urn} token={this.state.token} />
    }
    else if(this.state.status == 'failed'){
      return <div>Failed</div>
    }    
    else if(this.state.status == 'disabled'){
      return <div>Disabled</div>
    }
    else {
      return <div>Loading</div>
    }
  }
})
