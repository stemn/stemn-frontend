import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import { getMeta } from 'stemn-shared/misc/Files/Files.actions.js'
import { push as pushRoute } from 'react-router-redux'
import { initCompare, changeMode, select } from 'stemn-shared/misc/FileCompare/FileCompare.actions'
import { get } from 'lodash'
import File from './File'

const stateToProps = ({ files, fileCompare, syncTimeline }, { params, location }) => {
  const { projectId, fileId } = params
  //  console.log(params);
  const revisionId = location.query.revision
  const cacheKey = `${fileId}-${revisionId}`
  return {
    cacheKey,
    fileId,
    compare: get(fileCompare, cacheKey, {}),
    file: files.fileMeta[cacheKey],
    projectId,
    revisonId: revisionId || '',
    timeline: get(syncTimeline, cacheKey, {}),
  }
}

const dispatchToProps = {
  changeMode,
  fetchTimeline,
  getMeta,
  initCompare,
  pushRoute,
  select,
}

const fetchConfigs = [{
  hasChanged: 'cacheKey',
  onChange: (props) => {
    props.getMeta({
      fileId: props.fileId,
      revisionId: props.revisionId,
      projectId: props.projectId,
      cacheKey: props.cacheKey,
    })
    props.fetchTimeline({
      entityType: 'file',
      types: ['commits', 'changes'],
      entityId: props.fileId,
      cacheKey: props.cacheKey,
    })
  },
}, {
  hasChanged: 'file.data.fileId',
  onChange: (props) => {
    if (get(props, 'file.data.fileId')) {
      props.initCompare({
        cacheKey: props.cacheKey,
        file: props.file,
      })
    }
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class FileContainer extends Component {
  render() {
    const { file } = this.props
    
    return file && file.data
      ? <File { ...this.props } />
      : null
  }
}
