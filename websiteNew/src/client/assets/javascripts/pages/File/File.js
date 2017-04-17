import React, { Component, PropTypes } from 'react';

import classNames from 'classnames';
import classes from './File.css';

import { projectRoute, fileRoute } from 'route-actions';

import { orderItemsByTime } from 'stemn-shared/misc/FileCompare/FileCompare.utils.js';
import { orderBy, has } from 'lodash';
import { formatBytes } from 'stemn-shared/misc/Files/utils';
import { getRevisions } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.utils.js';
import moment from 'moment';

import AssemblyParts from 'stemn-shared/misc/Files/PreviewFile/PreviewCad/AssemblyParts/AssemblyParts';
import DragResize from 'stemn-shared/misc/DragResize/DragResize';
import FileBreadCrumbs from 'stemn-shared/misc/FileList/components/FileBreadCrumbs';
import SectionTitle from 'stemn-shared/misc/Titles/SectionTitle/SectionTitle';
import SimpleTable from 'stemn-shared/misc/Tables/SimpleTable/SimpleTable';
import Timeline from 'stemn-shared/misc/Timeline/Timeline';
import TimelineVertical from 'stemn-shared/misc/TimelineVertical/TimelineVertical';
import FileCompareInner from 'stemn-shared/misc/FileCompare/FileCompareInner/FileCompareInner';
import FileCompareMenu from 'stemn-shared/misc/FileCompare/FileCompareMenu';



class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected1: props.file,
      selected2: undefined,
      lastSelected: 1,
      mode: 'single'
    }
  }
  
  clickFileOrFolder = ({ file }) => {
    const { fileId, revisionId } = file;
    const { pushRoute } = this.props;
    const projectId = this.props.file.data.project._id;

    if(file.type == 'file'){
      pushRoute(fileRoute({fileId, projectId, revisionId}));
    }
    else if(projectId){
      pushRoute(projectRoute({projectId}));
    }
  }
  
  changeMode = (mode, revisions) => {
    let { selected1, selected2 } = this.state;
    // If a second file is not selected - we select one if possible
    if(!selected2){
      const revisionIndex = revisions.findIndex(revision => revision.data.fileId == selected1.data.fileId && revision.data.revisionId == selected1.data.revisionId);
      if(revisions[revisionIndex - 1]){selected2 = revisions[revisionIndex - 1];}
      else if(revisions[revisionIndex + 1]){selected2 = revisions[revisionIndex + 1];}
    }
    this.setState({mode, selected2})
  }
  
  onSelect = (response) => {
    const stateToSet = this.state.mode == 'single' || this.state.lastSelected == 2
    ? {selected1: response, lastSelected: 1}
    : {selected2: response, lastSelected: 2};
    this.setState(stateToSet);
  }
  
  clickTag = (task) => {
    this.props.dispatch(ModalActions.showModal({modalType: 'TASK', limit: 1, modalProps: { taskId: task._id }}));
    this.props.dispatch(ElectronWindowsActions.show('main'))
  }
  
  isSelected = (item) => {
    const selected1 = has(this.state, 'selected1.data.revisionId') ? item.data.revisionId == this.state.selected1.data.revisionId : false;
    const selected2 = has(this.state, 'selected2.data.revisionId') ? item.data.revisionId == this.state.selected2.data.revisionId : false;
    return this.state.mode == 'single' ? selected1 : selected1 || selected2;
  }
  
  render() {
    const { file, syncTimeline, relatedTasks } = this.props;
    const { mode, selected1, selected2 } = this.state;
    const filesOrdered = orderItemsByTime(mode, selected1, selected2);
    const file1 = filesOrdered[0] ? filesOrdered[0].data : undefined;
    const file2 = filesOrdered[1] ? filesOrdered[1].data : undefined;
    
    const revisions = getRevisions(syncTimeline.data);
    const displayFileHeader = ['sideBySide', 'aboveAndBelow'].includes(mode);

    return (
      <div className='layout-column flex'>
        <div className={ classes.header }>
          <FileBreadCrumbs meta={ file.data } clickFn={ this.clickFileOrFolder } popup />
          <div className='flex'/>
          <FileCompareMenu
            file1={ file1 }
            file2={ file2 }
            revisions={ revisions }
            mode={ mode }
            changeMode={ this.changeMode }
          />
        </div>
        <div className='layout-row flex'>
          <div className='layout-column flex'>
            <FileCompareInner
              className='layout-column flex'
              project={ file.data.project }
              file1={ file1 }
              file2={ file2 }
              mode={ mode }
              header={ displayFileHeader } 
            />
            <Timeline
              className={ classes.timeline }
              items={ syncTimeline.data }
              onSelect={ this.onSelect }
              isSelected={ this.isSelected }
              preferPlace='above'
            />
          </div>
          <DragResize side="left" width="450" widthRange={[0, 450]} className="layout-column">
            <aside className={ classes.sidebar + ' layout-column flex' }>
              <SectionTitle className={ classes.sidebarTitle }>Meta</SectionTitle>
              <SimpleTable>
                <tr><td>Name</td><td>{file.data.name}</td></tr>
                <tr><td>Size</td><td>{formatBytes(file.data.size)}</td></tr>
                <tr><td>Last modified</td><td>{moment(file.data.modified).fromNow()}</td></tr>
                { revisions.length > 0
                ? <tr><td>Revisions</td><td>{revisions.length}</td></tr>
                : null }
              </SimpleTable>
              <AssemblyParts 
                fileMeta={ file } 
                clickFn={ this.clickFileOrFolder }
              />
              <SectionTitle className={ classes.sidebarTitle }>Timeline</SectionTitle>
              <TimelineVertical
                items={ syncTimeline.data }
                type="file"
              />
            </aside>
          </DragResize>
        </div>
      </div>
    )
  }
}
//

export default File;
