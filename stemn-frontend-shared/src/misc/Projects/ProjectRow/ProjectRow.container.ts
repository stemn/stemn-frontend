import * as React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { getProject } from 'stemn-shared/misc/Projects/Projects.actions'
import { ProjectRow } from './ProjectRow'

const stateToProps = (state, { projectId }) => ({
  project: state.projects.data[projectId],
})

const dispatchToProps = {
  getProject,
}

const fetchConfigs = [{
  hasChanged: 'projectId',
  onChange: (props) => {
    props.getProject({
      projectId: props.projectId,
      size: 'md',
    })
  },
}]

export interface IProjectRowContainerProps {
  projectId: string,
  size?: 'wide',
  className?: string,
  style?: object,
}

export const ProjectRowContainer = compose(
  connect(stateToProps, dispatchToProps),
  fetchDataHoc(fetchConfigs),
)(ProjectRow) as React.SFC<IProjectRowContainerProps>
