import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { getThread } from 'stemn-shared/misc/Threads/Threads.actions'
import { replace } from 'react-router-redux'
import { projectThreadRoute } from 'route-actions'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'

const stateToProps = ({ threads }, { params }) => {
  const threadId = params.threadId
  const thread = threads.data[threadId]
  return {
    threadId,
    thread,
  }
}

const dispatchToProps = {
  getThread,
  replace, 
}

const fetchConfigs = [{
  hasChanged: 'threadId',
  onChange: (props) => {
    props.getThread({
      threadId: props.threadId,
    })
  },
}, {
  hasChanged: 'thread',
  onChange: (props) => {
    // This will redirect to the thread project page after we have the project id
    if (props.thread && props.thread.data) {
      props.replace(projectThreadRoute({
        threadId: props.threadId,
        projectId: props.thread.data.project._id,
      }))
    }
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ThreadContainer extends Component {
  render() {
    return (
      <LoadingOverlay show />
    )
  }
}
