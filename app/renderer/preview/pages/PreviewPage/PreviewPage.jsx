// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import FileCompare        from 'app/renderer/main/modules/FileCompare/FileCompare.jsx';
import FileCompareHeader  from 'app/renderer/main/modules/FileCompare/FileCompareHeader/FileCompareHeader.jsx';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render() {
    const { } = this.props
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
        <FileCompareHeader
         compareId={`preview-${project._id}-${file.fileId}`}
         file1={file} />
        <FileCompare
          compareId={`preview-${project._id}-${file.fileId}`}
          project={project}
          file1={file}/>
      </div>
    );
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
