import { connect } from 'react-redux';

import { upload } from './Upload.actions.js'
import { actions } from 'react-redux-form'

import React from 'react'

import classNames from 'classnames'
import classes from './Upload.css'

import Dropzone from 'react-dropzone';
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import MdFileUpload from 'react-icons/md/file-upload'

export const Component = React.createClass({
  dropStyle: {
    minHeight: '50px',
  },

  dropActiveStyle: {
    outline: '4px solid #82c382'
  },

  onDrop(files) {
    this.props.upload({
      files,
      cacheKey: this.props.uploadId
    }).then(response => {
      this.props.change(this.props.model, response.value.data.url)
    })
  },

  onOpenClick() {
    this.refs.dropzone.open();
  },

  renderOverlay() {
    return (
      <div className={ classNames('layout-column layout-align-center-center', classes.overlay)}>
        <MdFileUpload size={ 30 } />
      </div>
    )
  },

  render() {
    const { uploadData, style, containerClassName, imageClassName, model, value } = this.props;

    const containerClasses = classNames(classes.container, containerClassName)
    const imageClasses = classNames(classes.image, imageClassName)

    return (
      <div style={ style } className={ containerClassName }>
        <Dropzone
          ref="dropzone"
          onDrop={ this.onDrop }
          activeStyle={ this.dropActiveStyle }
          disableClick={ false }
          multiple={ false }>
          <div className="layout-row layout-align-start-start">
            { uploadData && uploadData.files && uploadData.files.length > 0
            ? uploadData.files.map((file, index) => (
              <div
                key={ index }
                className={ imageClasses }
                style={ { backgroundImage: `url(${file.path ? `https://stemn.com${file.path}` : file.preview})`} }>
                { !uploadData.loading
                ? this.renderOverlay()
                : null }
                <LoadingOverlay
                  progress={ uploadData.percentage }
                  show={ uploadData.loading }
                  size="sm"
                  background="rgba(255, 255, 255, 0.8)"
                />
              </div>
            ))
            : <div
                className={ imageClasses }
                style={ value ? { backgroundImage: `url(https://stemn.com${value})` } : {} }
              >
                { this.renderOverlay() }
              </div>
            }
          </div>
        </Dropzone>
      </div>
    );
  }
});

const mapStateToProps = ({ upload }, { uploadId }) => ({
  uploadData: upload[uploadId]
})

const mapDispatchToProps = {
  upload,
  change: actions.change,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
