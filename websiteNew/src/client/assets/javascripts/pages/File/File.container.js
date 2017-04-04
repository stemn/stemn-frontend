import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc';

import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js';
import { getMeta, getRelatedTasks } from 'stemn-shared/misc/Files/Files.actions.js';
import { push as pushRoute } from 'react-router-redux';

import File from './File';

const stateToProps = ({ files, syncTimeline }, { params }) => {
  const { projectId, fileId, revisionId } = params;
  const cacheKey = `${fileId}-${revisionId}`;
  return {
    cacheKey,
    fileId,
    file: files.fileMeta[cacheKey],
    projectId,
    revisonId: revisionId || '',
    syncTimeline: syncTimeline[fileId],
    relatedTasks: files.relatedTasks[fileId],
  }
};

const dispatchToProps = {
  fetchTimeline,
  getMeta,
  getRelatedTasks,
  pushRoute,
};

const fetchConfigs = [{
  hasChanged: 'cacheKey',
  onChange: ({ getMeta, fileId, revisionId, projectId }) => getMeta({ fileId, revisionId, projectId })
},{
  hasChanged: 'cacheKey',
  onChange: ({ getRelatedTasks, fileId, projectId }) => getRelatedTasks({ fileId, projectId })
},{
  hasChanged: 'cacheKey',
  onChange: ({ fetchTimeline, fileId, projectId }) => fetchTimeline({ fileId, projectId })
}];

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class FileContainer extends Component {
  render() {
    const { file, syncTimeline, relatedTasks } = this.props;
    
    return file && file.data && syncTimeline && syncTimeline.data && relatedTasks
      ? <File {...this.props} />
      : null
  }
}




