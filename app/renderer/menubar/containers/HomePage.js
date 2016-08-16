import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as ChangeActions from 'app/shared/actions/changes';
import * as ProjectsActions from 'app/shared/actions/projects';

function mapStateToProps({ changes, projects }, otherProps) {
  return {
    changes: changes,
    project: projects[otherProps.params.stub]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ChangeActions : bindActionCreators(ChangeActions, dispatch),
    ProjectsActions : bindActionCreators(ProjectsActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
