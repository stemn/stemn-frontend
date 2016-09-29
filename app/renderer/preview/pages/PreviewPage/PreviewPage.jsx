// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Actions
import * as FilesActions from 'app/renderer/main/modules/Files/Files.actions.js';

// Sub Components
import FileCompare        from 'app/renderer/main/modules/FileCompare/FileCompare.jsx';
import FileCompareHeader  from 'app/renderer/main/modules/FileCompare/FileCompareHeader/FileCompareHeader.jsx';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  componentWillMount() {
    const { revisionId, fileId} = this.props.params;
    if(fileId){
      this.props.filesActions.getMeta({fileId, revisionId})
    }
  },
  render() {
    const { fileMeta } = this.props
    const file = {
      extension : "png",
      fileId : "57c3f21fa0a6a69629f7965d",
      name : "asfafsafsfsa.png",
      path : "asfafsafsfsa.png",
      provider : "drive",
      revisionId : "57c3f21f5de772742e19e80a",
      size : "951687",
    }
    const project = {
      _id : "57ec666326c9751f01de62da",
      stub : "timeline-test",
      remote: {
        provider: 'drive'
      }
    }

    return (
      <div className="layout-column flex">
        {
          fileMeta && fileMeta.data
          ? <div className="layout-column flex">
              <FileCompareHeader
               compareId={`preview-${fileMeta.data.fileId}}`}
               file1={fileMeta.data} />
              <FileCompare
                compareId={`preview-${fileMeta.data.fileId}}`}
                project={fileMeta.data.project}
                file1={fileMeta.data}/>
            </div>
          : ''
        }
      </div>
    );
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({files}, {params}) {
  console.log(files);
  const cacheKey = `${params.fileId}-${params.revisionId}`
  return {
    fileMeta: files.fileMeta[cacheKey]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    filesActions: bindActionCreators(FilesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
