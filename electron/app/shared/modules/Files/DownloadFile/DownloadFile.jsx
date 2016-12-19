// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as FilesActions from '../Files.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import LoadingOverlay     from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import { getDownloadUrl } from '../Files.utils.js';

///////////////////////////////// COMPONENT /////////////////////////////////

export const DownloadFile = React.createClass({
  render() {
    const { children, title,
      filesActions, file, fileUrl, progress } = this.props;
    const saveFile = () => {
      filesActions.getFullPath({
        path: file.path,
        projectId: file.project._id,
        provider: file.provider
      }).then(filePath => {
        filesActions.saveFile({fileUrl, filePath})
      })
    };

    return (
      <a className="link-primary" onClick={saveFile} title={title}>
        {children}
        <LoadingOverlay show={progress && progress>0 && progress<100} linear={true} hideBg={true} />
      </a>
    );
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({files}, {file}) {
  const fileUrl = getDownloadUrl(file);
  return {
    fileUrl: fileUrl,
    progress: files.downloadProgress[fileUrl]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    filesActions: bindActionCreators(FilesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadFile);
