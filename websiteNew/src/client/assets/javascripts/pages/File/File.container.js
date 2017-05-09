import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import { getMeta, getRelatedTasks } from 'stemn-shared/misc/Files/Files.actions.js'
import { push as pushRoute } from 'react-router-redux'
import { initCompare, changeMode, select } from 'stemn-shared/misc/FileCompare/FileCompare.actions'
import { get } from 'lodash'
import File from './File'

const stateToProps = ({ files, fileCompare, syncTimeline }, { params }) => {
  const { projectId, fileId, revisionId } = params;
  const cacheKey = `${fileId}-${revisionId}`;
  return {
    cacheKey,
    fileId,
    compare: get(fileCompare, cacheKey, {}),
    file: files.fileMeta[cacheKey],
    projectId,
    revisonId: revisionId || '',
    timeline: get(syncTimeline, cacheKey, {}),
    relatedTasks: files.relatedTasks[fileId],
  }
};

const dispatchToProps = {
  changeMode,
  fetchTimeline,
  getMeta,
  getRelatedTasks,
  initCompare,
  pushRoute,
  select,
};

const fetchConfigs = [{
  hasChanged: 'cacheKey',
  onChange: (props) => {
    props.getMeta({
      fileId: props.fileId,
      revisionId: props.revisionId,
      projectId: props.projectId,
    })
    props.getRelatedTasks({
      fileId: props.fileId,
      projectId: props.projectId,
    })
    props.fetchTimeline({
      entityType: 'file',
      entityId: props.fileId,
      cacheKey: props.cacheKey,
    })
  }
},{
  hasChanged: 'file.data.fileId',
  onChange: (props) => {
    if (get(props, 'file.data.fileId')) {
      props.initCompare({
        cacheKey: props.cacheKey,
        file: props.file,
      })
    }
  }
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class FileContainer extends Component {
  render() {
    const { file } = this.props;
    
    return file && file.data
      ? <File {...this.props} />
      : null
  }
}
