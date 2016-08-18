import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Changes from '../components/Changes';
import * as ChangesActions from '../../../shared/actions/changes';

//import wrapActions from 'app/shared/helpers/wrapActions.js'

function mapStateToProps({changes, projects}, {params}) {
  const project = projects[params.stub];
  return {
    project: project,
    changes: changes[project._id],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changesActions: bindActionCreators(ChangesActions, dispatch)
  }
}

//function mergeProps(stateProps, dispatchProps, ownProps){
//  const wrappedDispatchProps = wrapActions(dispatchProps.changesActions, {projectId: stateProps.project._id});
//  console.log(wrapActions);
//
//  console.log(wrappedDispatchProps);
//  return Object.assign({}, ownProps, stateProps, wrappedDispatchProps)
//}

export default connect(mapStateToProps, mapDispatchToProps)(Changes);
