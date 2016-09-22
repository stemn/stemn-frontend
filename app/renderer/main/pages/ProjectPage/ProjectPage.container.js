import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ProjectPage from './ProjectPage';
import * as ProjectActions from 'app/shared/actions/project.js';
import * as ProjectsActions from 'app/shared/actions/projects.js';


function mapStateToProps({projects}, otherProps) {
  return {
    project: projects.data[otherProps.params.stub]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ProjectActions: bindActionCreators(ProjectActions, dispatch),
    ProjectsActions: bindActionCreators(ProjectsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
