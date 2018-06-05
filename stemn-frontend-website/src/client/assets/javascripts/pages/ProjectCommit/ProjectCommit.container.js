import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { getCommit } from 'stemn-shared/misc/Commits/Commits.actions.js'
import ProjectCommit from './ProjectCommit'

const stateToProps = ({ projects, commits }, { params }) => {
  const projectId = params.stub
  const commitId = params.commitId
  const project = projects.data[projectId]
  const commit = commits[commitId]

  return {
    project,
    projectId,
    commitId,
    commit,
  }
}

const dispatchToProps = {
  getCommit,
}

const fetchConfigs = [{
  hasChanged: 'commitId',
  onChange: ({ getCommit, commitId }) => getCommit({ commitId }),
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ProjectCommitContainer extends Component {
  render() {
    return (
      <ProjectCommit { ...this.props } />
    )
  }
}
