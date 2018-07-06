import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import TeamMember from 'stemn-shared/misc/Project/TeamMember/TeamMember.jsx'
import UserSearch from 'stemn-shared/misc/Search/UserSearch'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'

export default class GeneralSettings extends Component {
  static propTypes = {
    changeUserPermissions: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    addTeamMember: PropTypes.func.isRequired,
    removeTeamMember: PropTypes.func.isRequired,
    saveProject: PropTypes.func.isRequired,
  }
  select = (selection) => {
    if (!this.props.project.data.team.find(item => item._id === selection._id)) {
      this.props.addTeamMember({
        projectId: this.props.project.data._id,
        user: selection,
      })
    }
  }
  changeUserPermissions = ({ role, userId }) => {
    this.props.changeUserPermissions({
      role,
      userId,
      projectId: this.props.project.data._id,
    })
  }
  removeTeamMember = ({ userId }) => {
    this.props.removeTeamMember({
      userId,
      projectId: this.props.project.data._id,
    })
  }
  saveProject = () => {
    this.props.saveProject({
      project: this.props.project.data,
    })
  }
  render() {
    const { project } = this.props
    
    return (
      <InfoPanel>
        <h3>Team Members</h3>
        <p>Invite your team to your project. STEMN adds your team members to your shared cloud storage folder.</p>
        <UserSearch 
          cacheKey={ project.data._id }
          select={ this.select } 
        />
        <br />
        { project.data.team.map(item => (
          <div style={ { marginBottom: '15px' } }  key={ item._id }>
            <TeamMember
              item={ item }
              changePermissionsFn={ this.changeUserPermissions }
              removeTeamMemberFn={ this.removeTeamMember }
            />
          </div>),
        )}
        <br />
        <div className="layout-row layout-align-end">
          <ProgressButton
            className="primary"
            onClick={ this.saveProject }
            loading={ project.savePending }
          >
            Update Team
          </ProgressButton>
        </div>
      </InfoPanel>
    )
  }
}

