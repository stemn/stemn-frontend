// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as UploadActions from './Upload.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import Dropzone from 'react-dropzone';
import Button from 'app/renderer/main/components/Buttons/Button/Button.jsx';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

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
      maxWidth: '100px',
      maxHeight: '100px',
      marginRight: '20px'
    }
    const {upload, style, className, model, value} = this.props;

    return (
      <div style={style} className={className}>
        <Dropzone ref="dropzone"
         onDrop={this.onDrop}
         style={this.dropStyle}
         activeStyle={this.dropActiveStyle}
         disableClick={true}>
          <div className="layout-row layout-align-start-start">
            {upload && upload.files && upload.files.length > 0
              ?
              <div className="layout-row layout-align-start-center">
                {upload.files.map((file, index) =>
                  <img key={index} style={imgStyle} src={file.path ? `https://stemn.com${file.path}` : file.preview} />
                )}
              </div>
              : null
            }
            <div>
              <Button className="secondary" onClick={this.onOpenClick}>Upload Picture</Button>
              <p>You can also drag and drop a picture from your computer.</p>
            </div>
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
