import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Page from './ProjectSettingsPage';

import * as ProjectActions from 'app/shared/actions/project.js';
import * as ProjectsActions from 'app/shared/actions/projects.js';
import * as ProjectSettingsActions from 'app/shared/actions/projectSettings.js';


function mapStateToProps({projects, projectSettings}, otherProps) {
  return {
    project: projects[otherProps.params.stub],
    projectSettings: projectSettings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ProjectActions: bindActionCreators(ProjectActions, dispatch),
    ProjectsActions: bindActionCreators(ProjectsActions, dispatch),
    ProjectSettingsActions: bindActionCreators(ProjectSettingsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
