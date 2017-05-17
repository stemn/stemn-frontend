import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getFullPath } from '../Files.actions.js';
import React from 'react';
import classNames from 'classnames';
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import { getDownloadUrl, saveFile } from '../utils';

///////////////////////////////// COMPONENT /////////////////////////////////

export const DownloadFile = React.createClass({
  saveFile() {
    const { file, fileUrl } = this.props
    this.props.getFullPath({
      path: file.path,
      projectId: file.project._id,
      provider: file.provider
    }).then(filePath => {
      this.props.saveFile({fileUrl, filePath})
    })
  },
  render() {
    const { children, title, file, fileUrl, progress } = this.props
    if (GLOBAL_ENV.APP_TYPE === 'web') {
      return (
        <a
          className="link-primary"
          href={ fileUrl }
          download={ file.name }
          title={ title }
        >
          { children }
        </a>
      )
    } else {
      return (
        <a
          className="link-primary"
          onClick={ this.saveFile }
          title={ title }
        >
          { children }
          <LoadingOverlay
            show={ progress && progress > 0 && progress < 100 }
            linear
            hideBg
          />
        </a>
      )
    }
  }
})


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({files}, {file}) {
  const fileUrl = getDownloadUrl(file);
  return {
    fileUrl: fileUrl,
    progress: files.downloadProgress[fileUrl]
  }
}

const dispatchToProps = {
  getDownloadUrl,
  saveFile,
}

export default connect(mapStateToProps, dispatchToProps)(DownloadFile)
