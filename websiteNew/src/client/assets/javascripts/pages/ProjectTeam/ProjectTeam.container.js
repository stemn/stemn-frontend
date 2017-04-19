import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProjectTeam from './ProjectTeam';

const stateToProps = () => ({

})

const dispatchToProps = {
}

@connect(stateToProps, dispatchToProps)
export default class ProjectTeamContainer extends Component {
  render() {
    return (
      <ProjectTeam {...this.props} />
    );
  }
}
