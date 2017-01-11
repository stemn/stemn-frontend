// Container Core
import { bindActionCreators } from 'redux';
import { connect, Provider } from 'react-redux';
import wrapProvider from 'website/src/app/redux/wrapProvider.js';

// Component Core
import React, { PropTypes } from 'react';
import { has } from 'lodash';

// Actions
import * as FilesActions from 'stemn-shared/misc/Files/Files.actions.js';
import * as SyncTimelineActions from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js';

// Sub Components
import { formatBytes }      from 'stemn-shared/misc/Files/utils';
import moment               from 'moment';
import LoadingOverlay       from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import cloudMagnify         from 'stemn-shared/assets/images/pure-vectors/cloud-magnify.svg';
import { orderItemsByTime } from 'stemn-shared/misc/FileCompare/FileCompare.utils.js';
import FileBreadCrumbs      from 'stemn-shared/misc/FileList/components/FileBreadCrumbs.jsx';
import Timeline             from 'stemn-shared/misc/Timeline/Timeline.jsx';
import AssemblyParts        from 'stemn-shared/misc/Files/PreviewFile/PreviewCad/AssemblyParts/AssemblyParts.jsx'
import FileCompareInner     from 'stemn-shared/misc/FileCompare/FileCompareInner/FileCompareInner.jsx';
import FileCompareMenu      from 'stemn-shared/misc/FileCompare/FileCompareMenu';
import Header               from 'stemn-shared/misc/Header/Header.jsx'
import DragResize           from 'stemn-shared/misc/DragResize/DragResize.jsx';
import SectionTitle         from 'stemn-shared/misc/Titles/SectionTitle/SectionTitle.jsx';
import SimpleTable          from 'stemn-shared/misc/Tables/SimpleTable/SimpleTable.jsx';
import classes              from './TestPage.css'

import { filePreviewRoute,
        projectFilesRoute } from 'route-actions';

///////////////////////////////// COMPONENT /////////////////////////////////

const propTypes = {
  params  : PropTypes.object.isRequired,
};

export const TestPage = React.createClass({
  // Mounting
  onMount(nextProps, prevProps){
    const hasFileMeta     = has(nextProps, 'fileMeta.data');
    const fileString1     = prevProps ? prevProps.fileId + prevProps.revisionId : '';
    const fileString2     = nextProps ? nextProps.fileId + nextProps.revisionId : '';
    const hasChangedFile  = fileString1 != fileString2;
    const fileMetaString1 = has(prevProps, 'fileMeta.data') ? prevProps.fileMeta.data.fileId + '-' + prevProps.fileMeta.data.revisionId : '';
    const fileMetaString2 = has(nextProps, 'fileMeta.data') ? nextProps.fileMeta.data.fileId + '-' + nextProps.fileMeta.data.revisionId : '';
    const hasMetaChanged  = fileMetaString1 != fileMetaString2;

    // Get the file meta if the file has changed
    if(hasChangedFile && !hasFileMeta){
      nextProps.filesActions.getMeta({
        projectId  : nextProps.projectId,
        fileId     : nextProps.fileId,
        revisionId : nextProps.revisionId
      });
    }
    
    if(hasMetaChanged){
      // Set the selected state if the file-meta was just received
      this.setState({
        selected1    : nextProps.fileMeta,
        selected2    : undefined,
        lastSelected : 1,
        mode         : 'single'
      });
      
      // Join the File room
      nextProps.filesActions.websocketJoinFile({
        fileId: nextProps.fileMeta.data.fileId
      });
      
      // Get the Timeline
      nextProps.syncTimelineActions.fetchTimeline({
        projectId  : nextProps.fileMeta.data.project._id,
        fileId     : nextProps.fileMeta.data.fileId,
      })
      
      // Get the Related Tasks
      nextProps.filesActions.getRelatedTasks({
        fileId     : nextProps.fileMeta.data.fileId,
        projectId  : nextProps.fileMeta.data.project._id
      })
    }
  },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  componentWillMount() { this.onMount(this.props) },
  getInitialState () {
    return {
      selected1    : undefined,
      selected2    : undefined,
      lastSelected : 1,
      mode         : 'single'
    }
  },
  onSelect(response){
    const stateToSet = this.state.mode == 'single' || this.state.lastSelected == 2
    ? {selected1: response, lastSelected: 1}
    : {selected2: response, lastSelected: 2};
    this.setState(stateToSet);
    // if(this.state.selected1 == this.state.selected2){this.setState({mode: 'single'})}
  },
  changeMode(mode, revisions){
    let { selected1, selected2 } = this.state;
    // If a second file is not selected - we select one if possible
    if(!selected2){
      const revisionIndex = revisions.findIndex(revision => revision.data.fileId == selected1.data.fileId && revision.data.revisionId == selected1.data.revisionId);
      if(revisions[revisionIndex - 1]){selected2 = revisions[revisionIndex - 1];}
      else if(revisions[revisionIndex + 1]){selected2 = revisions[revisionIndex + 1];}
    }
    this.setState({mode, selected2})
  },
  isSelected(item){
    const selected1 = has(this.state, 'selected1.data.revisionId') ? item.data.revisionId == this.state.selected1.data.revisionId : false;
    const selected2 = has(this.state, 'selected2.data.revisionId') ? item.data.revisionId == this.state.selected2.data.revisionId : false;
    return this.state.mode == 'single' ? selected1 : selected1 || selected2;
  },
  clickCrumb({file}){
    const { dispatch, fileMeta } = this.props;
    if(file.type == 'file'){
      // It is a file - open the file
      dispatch(filePreviewRoute({
        fileId     : file.fileId,
        revisionId : file.revisionId,
        projectId  : file.project._id,
      }))
    }
    else if(fileMeta.data.project._id){
      // It is a folder (and is linked to a project) - open the folder
      dispatch(projectFilesRoute({
        projectId : fileMeta.data.project._id,
        path      : file.fileId
      }))
    }
    else{
      console.log('Not linked to project - open folder');
    }
  },
  clickTag(task){
    this.props.dispatch(ModalActions.showModal({modalType: 'TASK', limit: 1, modalProps: { taskId: task._id }}));
  },
  render() {
    const { fileMeta, syncTimeline, relatedTasks } = this.props;
    const { mode, selected1, selected2 } = this.state;
    const hasFileMeta = fileMeta && fileMeta.data;
    const isPartOfProject = hasFileMeta && fileMeta.data.project && fileMeta.data.project._id;
    const items = orderItemsByTime(mode, selected1, selected2);
    const file1 = items[0] ? items[0].data : undefined;
    const file2 = items[1] ? items[1].data : undefined;
    const revisions = syncTimeline && syncTimeline.data ? syncTimeline.data.filter(item => item.event == 'revision') : [];

    return (
      <div className="layout-column flex">
        <Header>
          <div className="no-drag">{hasFileMeta ? <FileBreadCrumbs meta={fileMeta.data} clickFn={this.clickCrumb} popup={true}/> : ''}</div>
          <div className="flex"></div>
          <FileCompareMenu
            file1={file1}
            file2={file2}
            revisions={revisions}
            mode={mode}
            changeMode={this.changeMode}
          />
          <div className="divider"></div>
        </Header>
        <div className="layout-row flex">
          <div className="layout-column flex">
            { hasFileMeta
            ? <FileCompareInner
              project={fileMeta.data.project}
              file1={file1}
              file2={file2}
              mode={mode}
              header={['sideBySide', 'aboveAndBelow'].includes(mode)} />
            : <div className="flex" /> }
            <Timeline className={classes.timeline}
              items={revisions}
              onSelect={this.onSelect}
              isSelected={this.isSelected}
              preferPlace="above"/>
          </div>
          <DragResize side="left" width="450" widthRange={[0, 450]} className="layout-column">
            <aside className={classes.sidebar + ' layout-column flex'} style={{minWidth: '400px', overflowY: 'auto'}}>
              <SectionTitle style={{marginBottom: '15px'}}>Meta</SectionTitle>
              { hasFileMeta
              ? <SimpleTable>
                  <tr><td>Name</td><td>{fileMeta.data.name}</td></tr>
                  <tr><td>Size</td><td>{formatBytes(fileMeta.data.size)}</td></tr>
                  <tr><td>Last modified</td><td>{moment(fileMeta.data.modified).fromNow()}</td></tr>
                  { revisions.length > 0
                  ? <tr><td>Revisions</td><td>{revisions.length}</td></tr>
                  : null }
                </SimpleTable>
              : null }
            { hasFileMeta ? <AssemblyParts fileMeta={fileMeta} clickFn={this.clickCrumb}/> : null }
            { relatedTasks && relatedTasks.data && relatedTasks.data.length > 0
            ? <div>
                <SectionTitle style={{margin: '30px 0 15px'}}>Related Tasks</SectionTitle>
                {orderBy(relatedTasks.data, ['complete']).map(task => <Tag key={task._id} text={task.name} onClick={() => this.clickTag(task)} />)}
              </div>
            : null }
            </aside>
          </DragResize>
        </div>
      </div>
    );
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ syncTimeline, files }, { params }) {
  const { localPath, revisionId, fileId, projectId } = params;
  const cacheKey = localPath ? fileId : `${fileId}-${revisionId}`;
  return {
    localPath,
    fileId,
    revisionId,
    projectId,
    fileMeta: files.fileMeta[cacheKey],
    syncTimeline: syncTimeline[fileId]       ? syncTimeline[fileId] : [],
    relatedTasks: files.relatedTasks[fileId] ? files.relatedTasks[fileId] : []
  }
}

function mapDispatchToProps(dispatch) {
  return {
    filesActions: bindActionCreators(FilesActions, dispatch),
    syncTimelineActions: bindActionCreators(SyncTimelineActions, dispatch),
    dispatch
  }
}

export default wrapProvider(connect(mapStateToProps, mapDispatchToProps)(TestPage), propTypes);
