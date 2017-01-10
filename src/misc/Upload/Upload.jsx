// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as UploadActions from './Upload.actions.js';
import { actions } from 'react-redux-form'

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import Dropzone from 'react-dropzone';
import Button from 'stemn-shared/misc/Buttons/Button/Button.jsx';
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import MdFileUpload from 'react-icons/md/file-upload';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


export const UploadOverlay = React.createClass({
  render: function () {
    const overlayStyle = {
      position: 'absolute', 
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      background: 'rgba(0, 0, 0, 0.2)',
    }
    return (
      <div style={overlayStyle} className="layout-column layout-align-center-center">
        <MdFileUpload size="30px" style={{color: 'white'}}/>
      </div>
    );
  }
});

export const Component = React.createClass({
  componentWillMount() {
    this.props.UploadActions.init({
      cacheKey: this.props.uploadId,
      files: [{
        path: this.props.value
      }]
    });
  },

  onDrop: function (files) {
    this.props.UploadActions.upload({
      files,
      cacheKey: this.props.uploadId
    }).then(response => {
      // Update the model
      this.props.dispatch(actions.change(this.props.model, response.value.data.url))
    })
  },

  dropStyle: {
    minHeight: '50px',
  },

  dropActiveStyle: {
    outline: '4px solid #82c382'
  },

  onOpenClick: function () {
    this.refs.dropzone.open();
  },

  render: function () {
    const imgStyle = {
      width: '130px',
      height: '130px',
      borderRadius: '50%',
      overflow: 'hidden',
      position: 'relative'
    }
    const {upload, style, className, model, value} = this.props;

    return (
      <div style={style} className={className}>
        <Dropzone ref="dropzone"
          onDrop={this.onDrop}
          style={this.dropStyle}
          activeStyle={this.dropActiveStyle}
          disableClick={false}
          multiple={false}>
          <div className="layout-row layout-align-start-start">
            { upload && upload.files && upload.files.length > 0
            ? <div className="layout-row layout-align-start-center">
                {upload.files.map((file, index) =>
                  <a key={index} style={imgStyle}>
                    <img style={{width: '100%', height: '100%'}} src={file.path ? `https://stemn.com${file.path}` : file.preview} />
                    { upload.loading ? null : <UploadOverlay /> }
                    <LoadingOverlay 
                      progress={upload.percentage}
                      show={upload.loading} 
                      size="sm"
                      background="rgba(255, 255, 255, 0.8)"
                    />
                  </a>
                )}
              </div>
            : <a style={imgStyle}><UploadOverlay /></a>
            }
          </div>
        </Dropzone>
      </div>
    );
  }
});



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({upload}, {uploadId}) {
  return {
    upload: upload[uploadId]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    UploadActions: bindActionCreators(UploadActions, dispatch),
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
