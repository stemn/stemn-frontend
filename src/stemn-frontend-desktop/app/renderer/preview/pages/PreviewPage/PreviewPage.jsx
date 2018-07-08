import React, { Component } from 'react'
import cn from 'classnames'
import classes from './PreviewPage.css'

import { orderItemsByTime, isSelected } from 'stemn-shared/misc/FileCompare/FileCompare.utils.js'
import { get } from 'lodash'
import { formatBytes } from 'stemn-shared/misc/Files/utils'
import { getRevisions } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.utils.js'
import moment from 'moment'

import AssemblyParts from 'stemn-shared/misc/Files/PreviewFile/PreviewCad/AssemblyParts/AssemblyParts'
import DragResize from 'stemn-shared/misc/DragResize/DragResize'
import FileBreadCrumbs from 'stemn-shared/misc/FileList/components/FileBreadCrumbs'
import SectionTitle from 'stemn-shared/misc/Titles/SectionTitle/SectionTitle'
import SimpleTable from 'stemn-shared/misc/Tables/SimpleTable/SimpleTable'
import Timeline from 'stemn-shared/misc/Timeline/Timeline'
import TimelineVertical from 'stemn-shared/misc/SyncTimeline/TimelineVertical'
import FileCompareInner from 'stemn-shared/misc/FileCompare/FileCompareInner/FileCompareInner'
import FileCompareMenu from 'stemn-shared/misc/FileCompare/FileCompareMenu'
import Header from 'stemn-shared/misc/Header/Header.jsx'

export default class PreviewPage extends Component {
  clickFileOrFolder = ({ file }) => {
    //    const { pushRoute } = this.props;
    //    const projectId = this.props.file.data.project._id;
    //    if (file.type == 'file') {
    //      pushRoute(fileRoute({fileId, projectId, revisionId}));
    //    } else if (projectId){
    //      pushRoute(projectRoute({projectId}));
    //    }

    const { fileId, revisionId, project: { _id: projectId } } = file
    const { pushRoute, showWindow } = this.props
    if (file.type == 'file') {
      // It is a file - open the file
      pushRoute({
        pathname: '/',
        query: {
          fileId,
          revisionId,
          projectId,
        },
      })
    } else if (projectId) {
      // It is a folder (and is linked to a project) - open the folder
      pushRoute({
        pathname: `/project/${projectId}/files/${fileId}`,
        state: { meta: { scope: ['main'] } },
      })
      showWindow('main')
    } else {
      console.log('Not linked to project - open folder')
    }
  }
  onSelect = (file) => {
    const { select, cacheKey, compare: { mode, lastSelected } } = this.props
    select({ file, mode, lastSelected, cacheKey })
  }
  changeMode = (mode) => {
    const { changeMode, cacheKey } = this.props
    changeMode({ cacheKey, mode })
  }
  isSelected = (item) => {
    const { compare: { selected1, selected2, mode } } = this.props
    return isSelected({ item, selected1, selected2, mode })
  }
  render() {
    const {
      compare: { mode, selected1, selected2 },
      file,
      timeline,
    } = this.props
    const items = orderItemsByTime(mode, selected1, selected2)
    const file1 = get(items, [0, 'data'])
    const file2 = get(items, [1, 'data'])
    const timelineData = get(timeline, 'data', [])
    const revisions = getRevisions(timelineData)
    const displayFileHeader = ['sideBySide', 'aboveAndBelow'].includes(mode)

    return (
      <div
        className="layout-column flex"
        style={ { overflow: 'hidden', maxHeight: '100vh' } }
      >
        <Header>
          <FileBreadCrumbs
            className="text-ellipsis no-drag"
            meta={ file.data }
            clickFn={ this.clickFileOrFolder }
            popup
          />
          <div className="flex" />
          <FileCompareMenu
            file1={ file1 }
            file2={ file2 }
            revisions={ revisions }
            mode={ mode }
            changeMode={ this.changeMode }
          />
          <div className="divider" />
        </Header>
        <div className="layout-row flex rel-box">
          <div className={ cn(classes.preview, 'layout-column flex') }>
            <FileCompareInner
              className="layout-column flex"
              project={ file.data.project }
              file1={ file1 }
              file2={ file2 }
              mode={ mode }
              header={ displayFileHeader }
            />
            <Timeline
              className={ classes.timeline }
              items={ timelineData }
              onSelect={ this.onSelect }
              isSelected={ this.isSelected }
              preferPlace="above"
            />
          </div>
          <DragResize
            side="left"
            width="450"
            widthRange={ [0, 450] }
            className="layout-column"
          >
            <aside className={ classes.sidebar }>
              <SectionTitle className={ classes.sidebarTitle }>Meta</SectionTitle>
              <SimpleTable>
                <tr><td>Name</td><td>{file.data.name}</td></tr>
                <tr><td>Size</td><td>{formatBytes(file.data.size)}</td></tr>
                <tr><td>Last modified</td><td>{moment(file.data.modified).fromNow()}</td></tr>
                { revisions.length > 0 &&
                <tr><td>Revisions</td><td>{revisions.length}</td></tr> }
              </SimpleTable>
              <AssemblyParts
                fileMeta={ file }
                clickFn={ this.clickFileOrFolder }
              />
              <SectionTitle className={ classes.sidebarTitle }>Timeline</SectionTitle>
              <TimelineVertical
                items={ timelineData }
                type="file"
              />
            </aside>
          </DragResize>
        </div>
      </div>
    )
  }
}

// export const Component = React.createClass({
//
//  // Mounting
//  onMount(nextProps, prevProps){
//    const hasFileMeta    = has(nextProps, 'fileMeta.data') && !nextProps.fileMeta.loading;
//    const string1        = prevProps ? prevProps.localPath + prevProps.projectId + prevProps.fileId + prevProps.revisionId : '';
//    const string2        = nextProps ? nextProps.localPath + nextProps.projectId + nextProps.fileId + nextProps.revisionId : '';
//    const hasChangedFile = string1 != string2;
//
//    if(string1 != string2){
//      // If localPath exists - we must get the fileId - this will get the meta
//      if(nextProps.localPath){
//        nextProps.filesActions.getMetaFromPath({
//          path       : nextProps.localPath
//        })
//      }
//      // If we do not yet have the meta, get it:
//      else if(!hasFileMeta){
//        nextProps.filesActions.getMeta({
//          projectId  : nextProps.projectId,
//          fileId     : nextProps.fileId,
//          revisionId : nextProps.revisionId
//        });
//      }
//    }
//  },
//  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
//  componentWillMount() { this.onMount(this.props) },
//  render() {
//    const { fileMeta } = this.props;
//    const hasFileMeta  = fileMeta && !fileMeta.loading && !fileMeta.data;
//
//
//    return (
//      <div className="layout-column flex">
//        { hasFileMeta ?
//          <div className="flex layout-column layout-align-center-center text-center">
//            <div style={{maxWidth: '300px'}}>
//              <img src={cloudMagnify} style={{width: '100px', height: '100px'}}/>
//              <div className="text-title-4" style={{marginBottom: '10px'}}>Could not locate this file</div>
//              <div className="text-title-5" style={{marginBottom: '20px'}}>This file could not be found in your connected cloud providers.</div>
//            </div>
//          </div>
//          : <PreviewPageInner fileMeta={fileMeta} />
//        }
//      </div>
//    );
//  }
// });
//

