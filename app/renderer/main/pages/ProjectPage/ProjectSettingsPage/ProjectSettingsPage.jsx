// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions from 'app/shared/actions/projects.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './ProjectSettingsPage.css'

// Sub Components
import { actions } from 'react-redux-form';

import NavPill from 'app/renderer/main/components/Buttons/NavPill/NavPill'

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const onMount = (nextProps, prevProps) => {
  if(nextProps.project && nextProps.project.data){
    if(!prevProps || nextProps.project.data._id !== prevProps.project.data._id){
    }
  }
}

export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},

  render() {
    const { entityModel, project, ProjectsActions, dispatch } = this.props;
    const baseLink = `project/${project.data._id}`;

    return (
      <div className={classes.container+' layout-row flex scroll-box'}>
        <div style={{width: '250px', marginRight: '15px'}}>
          <div className={classes.panel} style={{padding: '0px'}}>
            <NavPill to={`${baseLink}/settings`} onlyActiveOnIndex={true}>General Settings</NavPill>
            <NavPill to={`${baseLink}/settings/tasks`}>Task Settings</NavPill>
            <NavPill to={`${baseLink}/settings/team`}>Team Settings</NavPill>
          </div>
        </div>
        <div style={{width: '650px'}}>
          {this.props.children}
        </div>
     </div>
    );
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({projects, projectSettings}, otherProps) {
  return {
    project: projects.data[otherProps.params.stub],
    entityModel: `projects.data.${otherProps.params.stub}`
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ProjectsActions: bindActionCreators(ProjectsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
