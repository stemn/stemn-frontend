import React from 'react';

import PreviewCode from './PreviewCode/PreviewCode'
import PreviewPcb from './PreviewPcb/PreviewPcb'
// Styles
import classNames from 'classnames';

export default class extends React.Component{
  componentWillMount() {
    this.props.filesActions.getFile({
      projectStub: this.props.projectStub,
      path: this.props.path
    })
    this.props.filesActions.getMeta({
      projectStub: this.props.projectStub,
      path: this.props.path
    })
  }
  render() {
    const getPreview = () => {
      if(this.props.file.data && this.props.file.meta){
        if(this.props.file.meta.fileType == 'md'){
          return <PreviewCode model={this.props.file.data} fileType={this.props.file.meta.fileType} />
        }
        else{
          return <PreviewPcb model={this.props.file.data} fileType={this.props.file.meta.fileType} />
        }
      }
    }
    return (
      <div>
        {getPreview()}
      </div>
    );
  }
};
