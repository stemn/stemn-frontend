import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Changes from '../components/Changes';
import * as ChangesActions from '../../../shared/actions/changes';

function mapStateToProps({changes, projects}, {params}) {
  const project = projects[params.stub];
  return {
    project: project,
    changes: changes[params.stub],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changesActions: bindActionCreators(ChangesActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Changes);
