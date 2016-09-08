// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions from 'app/shared/actions/projects.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from '../ProjectSettingsPage.css'

// Sub Components
import { Field, actions } from 'react-redux-form';

import UserSearch from 'app/renderer/main/modules/UserSearch/UserSearch.container.js'
import TeamMember from 'app/renderer/main/components/Project/TeamMember/TeamMember.jsx'
import Button from 'app/renderer/main/components/Buttons/Button/Button'

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const onMount = (nextProps, prevProps) => {
  if(nextProps.project && nextProps.project.data){
    if(!prevProps || nextProps.project.data._id !== prevProps.project.data._id){
      // Init the filestore form model
      // nextProps.dispatch(actions.load(`${nextProps.entityModel}.formModels.fileStore.remote`, nextProps.project.data.remote))
    }
  }
}

export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},

  selectFn(selection){
    if(!this.props.project.data.team.find((item)=>item._id == selection._id)){
      this.props.ProjectsActions.addTeamMember({
        projectId: this.props.project.data._id,
        user: selection
      })
    }
  },
  changePermissionsFn({role, userId}){
    this.props.ProjectsActions.changeUserPermissions({
      role,
      userId,
      projectId: this.props.project.data._id,
    })
  },
  removeTeamMemberFn({userId}){
    this.props.ProjectsActions.removeTeamMember({
      userId,
      projectId: this.props.project.data._id,
    })
  },
  saveProject(){
    this.props.ProjectsActions.saveProject({
      project: this.props.project.data
    })
  },
  render() {
    const { entityModel, project, ProjectsActions, dispatch } = this.props;
    const PageStyles = {
      padding: '20px 40px'
    }

    return (
      <div className={classes.panel}>
        <h3>Team Members</h3>
        <p>Invite your collaborators. If you've connected your project with Dropbox or Drive, your team members will be invited to edit.</p>
        <UserSearch select={this.selectFn} />
        <br />
        {project.data.team.map((item)=><div style={{marginBottom: '15px'}}><TeamMember item={item} changePermissionsFn={this.changePermissionsFn} removeTeamMemberFn={this.removeTeamMemberFn}/></div>)}
        <br />
        <div className="layout-row layout-align-end">
          <Button className="primary" onClick={this.saveProject}>Update team</Button>
        </div>
      </div>
    );
  }
});
/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({projects}, otherProps) {
  return {
    project: projects[otherProps.params.stub],
    entityModel: `projects.${otherProps.params.stub}`
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ProjectsActions: bindActionCreators(ProjectsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
