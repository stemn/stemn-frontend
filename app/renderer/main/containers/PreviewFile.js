import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PreviewFile from 'app/renderer/main/components/PreviewFile/PreviewFile';
import * as filesActions from 'app/shared/actions/files';

//console.log(filesActions);

function mapStateToProps({files}, {project, file}) {
  return {
    fileData: files[`${project._id}-${file.fileId}-${file.revisionId}`]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    filesActions: bindActionCreators(filesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewFile);
