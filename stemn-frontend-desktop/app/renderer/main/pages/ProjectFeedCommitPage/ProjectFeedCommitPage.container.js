import { connect } from 'react-redux'
import ProjectFeedCommitPage from './ProjectFeedCommitPage'
import { get } from 'lodash'

import { toggleMulti }     from 'stemn-shared/misc/TogglePanel/TogglePanel.actions.js'


const stateToProps = ({ projects, syncTimeline }, { params }) => {
  const projectId = params.stub
  const commitId = params.commitId
  const commit = get(syncTimeline, [projectId, 'data'], []).find(item => item._id === commitId)
  const project = projects.data[projectId]
  return {
    project,
    commit,
  }
}

const dispatchToProps = {
  toggleMulti,
}

export default connect(stateToProps, dispatchToProps)(ProjectFeedCommitPage)
