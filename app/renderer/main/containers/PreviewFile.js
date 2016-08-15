import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PreviewFile from 'app/renderer/main/components/PreviewFile/PreviewFile';
import * as filesActions from 'app/shared/actions/files';

//console.log(filesActions);

function mapStateToProps(params, otherProps) {
  return {
    file: params.files[otherProps.projectStub+'/'+otherProps.path]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    filesActions: bindActionCreators(filesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewFile);
