import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as ChangeActions from 'app/renderer/main/modules/Changes/Changes.actions.js';
import * as ProjectsActions from 'app/shared/actions/projects';

function mapStateToProps({changes, projects}, {params}) {
  const project = projects.data[params.stub];
  return {
    project: project,
    changes: changes[params.stub],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ChangeActions : bindActionCreators(ChangeActions, dispatch),
    ProjectsActions : bindActionCreators(ProjectsActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
