import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import { getMeta, getRelatedThreads } from 'stemn-shared/misc/Files/Files.actions.js'
import { show as showWindow } from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js';
import { push as pushRoute } from 'react-router-redux'
import { initCompare, changeMode, select } from 'stemn-shared/misc/FileCompare/FileCompare.actions'
import { get } from 'lodash'
import cloudMagnify  from 'stemn-shared/assets/images/pure-vectors/cloud-magnify.svg'
import PreviewPage from './PreviewPage'

const stateToProps = ({ files, fileCompare, syncTimeline }, { params, location }) => {
  let { localPath, revisionId, fileId, projectId } = location.query;
  fileId = fileId || (files.pathToId[localPath] ? files.pathToId[localPath].data : '');

  const cacheKey = `${fileId}-${revisionId}`
  return {
    cacheKey,
    fileId,
    compare: get(fileCompare, cacheKey, {}),
    file: files.fileMeta[cacheKey],
    projectId,
    revisonId: revisionId || '',
    timeline: get(syncTimeline, cacheKey, {}),
    relatedThreads: files.relatedThreads[fileId],
  }
};

const dispatchToProps = {
  changeMode,
  fetchTimeline,
  getMeta,
  getRelatedThreads,
  initCompare,
  pushRoute,
  select,
  showWindow,
};

const fetchConfigs = [{
  hasChanged: 'cacheKey',
  onChange: (props) => {
    props.getMeta({
      fileId: props.fileId,
      revisionId: props.revisionId,
      projectId: props.projectId,
      cacheKey: props.cacheKey,
    })
    props.getRelatedThreads({
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
export default class PreviewPageContainer extends Component {
  render() {
    const { file } = this.props
    return file && file.data
      ? <PreviewPage {...this.props} />
      : <div className="flex layout-column layout-align-center-center text-center">
          <div style={ { maxWidth: '300px' } }>
            <img src={ cloudMagnify } style={ { width: '100px', height: '100px' } }/>
            <div className="text-title-4" style={ { marginBottom: '10px' } }>Could not locate this file</div>
            <div className="text-title-5" style={ { marginBottom: '20px' } }>This file could not be found in your connected cloud providers.</div>
          </div>
        </div>
  }
}
