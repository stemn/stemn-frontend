import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import { getMeta, getMetaFromPath } from 'stemn-shared/misc/Files/Files.actions.js'
import { show as showWindow } from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import { push as pushRoute } from 'react-router-redux'
import { initCompare, changeMode, select } from 'stemn-shared/misc/FileCompare/FileCompare.actions'
import { get } from 'lodash'
import cloudMagnify  from 'stemn-shared/assets/images/pure-vectors/cloud-magnify.svg'
import PreviewPage from './PreviewPage'

const stateToProps = ({ files, fileCompare, syncTimeline }, { params, location }) => {
  const { localPath, revisionId, fileId, projectId } = location.query
  const cacheKeyWithLocal = `${localPath}-${fileId}-${revisionId}`
  // We use the standard cacheKey also so the data
  // is accesible in place where we don't use localPath
  const cacheKey = `${fileId}-${revisionId}`
  
  return {
    localPath,
    cacheKey,
    cacheKeyWithLocal,
    fileId,
    compare: get(fileCompare, cacheKey, {}),
    file: files.fileMeta[cacheKeyWithLocal],
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
  showWindow,
  getMetaFromPath,
}

const fetchConfigs = [{
  hasChanged: 'cacheKeyWithLocal',
  onChange: (props) => {
    // If we have localPath, we use that to look up fileId, projectId etc
    if (props.localPath) {
      props.getMetaFromPath({
        path: props.localPath,
        cacheKey: props.cacheKeyWithLocal,
      })
    } else {
      props.getMeta({
        fileId: props.fileId,
        revisionId: props.revisionId,
        projectId: props.projectId,
        cacheKey: props.cacheKeyWithLocal,
      })
    }
  },
}, {
  hasChanged: 'file.data.fileId',
  onChange: (props) => {
    if (get(props, 'file.data.fileId')) {
      props.fetchTimeline({
        entityType: 'file',
        entityId: props.file.data.fileId,
        cacheKey: props.cacheKey,
      })
      props.initCompare({
        cacheKey: props.cacheKey,
        file: props.file,
      })
    }
  },
}]


@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class PreviewPageContainer extends Component {
  render() {
    const { file } = this.props
    return file && file.data
      ? <PreviewPage { ...this.props } />
      : <div className="flex layout-column layout-align-center-center text-center">
        <div style={ { maxWidth: '300px' } }>
          <img src={ cloudMagnify } style={ { width: '100px', height: '100px' } } />
          <div className="text-title-4" style={ { marginBottom: '10px' } }>Could not locate this file</div>
          <div className="text-title-5" style={ { marginBottom: '20px' } }>This file could not be found in your connected cloud providers.</div>
        </div>
      </div>
  }
}
