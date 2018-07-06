// // Container Core
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
//
// // Container Actions
//
// // Component Core
// import React from 'react';
//
// // Styles
// import cn from 'classnames';
//
// // Functions
// import { orderBy, has }        from 'lodash';
// import moment from 'moment';
// import { formatBytes } from 'stemn-shared/misc/Files/utils'
//
// // Actions
// import * as FilesActions        from 'stemn-shared/misc/Files/Files.actions.js';
// import * as SyncTimelineActions from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js';
// import * as ModalActions        from 'stemn-shared/misc/Modal/Modal.actions.js';
// import * as ElectronWindowsActions from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js';
// import { push } from 'react-router-redux';
//
//
// // Sub Components
// import { orderItemsByTime } from 'stemn-shared/misc/FileCompare/FileCompare.utils.js';
// import { getRevisions }     from 'stemn-shared/misc/SyncTimeline/SyncTimeline.utils.js';
// import FileCompareInner     from 'stemn-shared/misc/FileCompare/FileCompareInner/FileCompareInner.jsx';
// import Timeline             from 'stemn-shared/misc/Timeline/Timeline.jsx';
// import DragResize           from 'stemn-shared/misc/DragResize/DragResize.jsx';
// import FileBreadCrumbs      from 'stemn-shared/misc/FileList/components/FileBreadCrumbs.jsx'
// import FileCompareMenu      from 'stemn-shared/misc/FileCompare/FileCompareMenu';
// import LoadingOverlay       from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
// import TimelineVertical     from 'stemn-shared/misc/SyncTimeline/TimelineVertical';
// import SimpleTable          from 'stemn-shared/misc/Tables/SimpleTable/SimpleTable.jsx';
// import SectionTitle         from 'stemn-shared/misc/Titles/SectionTitle/SectionTitle.jsx';
// import AssemblyParts        from 'stemn-shared/misc/Files/PreviewFile/PreviewCad/AssemblyParts/AssemblyParts.jsx'
// import Tag                  from 'stemn-shared/misc/Tags/Tag';
// import Header               from 'stemn-shared/misc/Header/Header.jsx'
//
// // Styles
// import classes from './PagePreview.css';
//
// ///////////////////////////////// COMPONENT /////////////////////////////////
//
// export const Component = React.createClass({
//  onMount(nextProps, prevProps){
//    const hasFileMeta    = has(nextProps, 'fileMeta.data');
//    const string1        = has(prevProps, 'fileMeta.data') ? prevProps.fileMeta.data.fileId + '-' + prevProps.fileMeta.data.revisionId : '';
//    const string2        = has(nextProps, 'fileMeta.data') ? nextProps.fileMeta.data.fileId + '-' + nextProps.fileMeta.data.revisionId : '';
//    const hasChangedFile = string1 != string2;
//    // If we have file Meta
//    if(hasFileMeta && hasChangedFile){
//      // If this is a sync file
//      if(has(nextProps, 'fileMeta.data.project._id')){
//        nextProps.syncTimelineActions.fetchTimeline({
//          projectId  : nextProps.fileMeta.data.project._id,
//          fileId     : nextProps.fileMeta.data.fileId,
//        })
//        nextProps.filesActions.getRelatedThreads({
//          fileId     : nextProps.fileMeta.data.fileId,
//          projectId  : nextProps.fileMeta.data.project._id
//        })
//      }
//      // Else, If this is remote file
//      else{
//        nextProps.syncTimelineActions.fetchTimeline({
//          fileId     : nextProps.fileMeta.data.fileId,
//          provider   : nextProps.fileMeta.data.provider,
//        })
//      }
//      this.setState({
//        selected1    : nextProps.fileMeta,
//        selected2    : undefined,
//        lastSelected : 1,
//        mode         : 'single'
//      });
//
//      // Join the File room
//      nextProps.filesActions.websocketJoinFile({
//        fileId: nextProps.fileMeta.data.fileId
//      });
//    }
//  },
//  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
//  componentWillMount() { this.onMount(this.props) },
//  getInitialState () {
//    return {
//      selected1    : undefined,
//      selected2    : undefined,
//      lastSelected : 1,
//      mode         : 'single'
//    }
//  },
//  onSelect(response){
//    const stateToSet = this.state.mode == 'single' || this.state.lastSelected == 2
//    ? {selected1: response, lastSelected: 1}
//    : {selected2: response, lastSelected: 2};
//    this.setState(stateToSet);
//  },
//  changeMode(mode, revisions){
//    let { selected1, selected2 } = this.state;
//    // If a second file is not selected - we select one if possible
//    if(!selected2){
//      const revisionIndex = revisions.findIndex(revision => revision.data.fileId == selected1.data.fileId && revision.data.revisionId == selected1.data.revisionId);
//      if(revisions[revisionIndex - 1]){selected2 = revisions[revisionIndex - 1];}
//      else if(revisions[revisionIndex + 1]){selected2 = revisions[revisionIndex + 1];}
//    }
//    this.setState({mode, selected2})
//  },
//  isSelected(item){
//    const selected1 = has(this.state, 'selected1.data.revisionId') ? item.data.revisionId == this.state.selected1.data.revisionId : false;
//    const selected2 = has(this.state, 'selected2.data.revisionId') ? item.data.revisionId == this.state.selected2.data.revisionId : false;
//    return this.state.mode == 'single' ? selected1 : selected1 || selected2;
//  },
//  clickCrumb({file}){
//    const { dispatch, fileMeta } = this.props;
//    if(file.type == 'file'){
//      // It is a file - open the file
//      dispatch(push({
//        pathname: '/',
//        query: {
//          fileId     : file.fileId,
//          revisionId : file.revisionId,
//          projectId  : file.project._id,
//        }
//      }))
//    }
//    else if(fileMeta.data.project._id){
//      // It is a folder (and is linked to a project) - open the folder
//      dispatch(push({
//        pathname: `/project/${fileMeta.data.project._id}/files/${file.fileId}`,
//        state: {meta : {scope: ['main']}}
//      }))
//      dispatch(ElectronWindowsActions.show('main'))
//    }
//    else{
//      console.log('Not linked to project - open folder');
//    }
//  },
//  clickTag(thread){
//    this.props.dispatch(ModalActions.showModal({modalType: 'TASK', limit: 1, modalProps: { threadId: thread._id }}));
//    this.props.dispatch(ElectronWindowsActions.show('main'))
//  },
//  render() {
//    const { fileMeta, syncTimeline, relatedThreads } = this.props;
//    const { mode, selected1, selected2 } = this.state;
//    const hasFileMeta = fileMeta && fileMeta.data;
//    const isPartOfProject = hasFileMeta && fileMeta.data.project && fileMeta.data.project._id;
//    const items = orderItemsByTime(mode, selected1, selected2);
//    const file1 = items[0] ? items[0].data : undefined;
//    const file2 = items[1] ? items[1].data : undefined;
//    const commitsAndChanges = syncTimeline && syncTimeline.data ? syncTimeline.data : [];
//    const revisions = getRevisions(commitsAndChanges);
//
//    return (
//      <div className="layout-column flex">
//        <Header>
//          <div className="no-drag">{hasFileMeta ? <FileBreadCrumbs meta={fileMeta.data} clickFn={this.clickCrumb} popup={true}/> : ''}</div>
//          <div className="flex"></div>
//          <FileCompareMenu
//            file1={file1}
//            file2={file2}
//            revisions={revisions}
//            mode={mode}
//            changeMode={this.changeMode}
//          />
//          <div className="divider"></div>
//        </Header>
//        <div className="layout-row flex">
//          <div className="layout-column flex">
//            { hasFileMeta
//            ? <FileCompareInner
//              project={fileMeta.data.project}
//              file1={file1}
//              file2={file2}
//              mode={mode}
//              header={['sideBySide', 'aboveAndBelow'].includes(mode)} />
//            : <div className="flex" /> }
//            <Timeline className={classes.timeline}
//              items={commitsAndChanges}
//              onSelect={this.onSelect}
//              isSelected={this.isSelected}
//              preferPlace="above"/>
//          </div>
//          <DragResize side="left" width="450" widthRange={[0, 450]} className="layout-column">
//            <aside className={classes.sidebar + ' layout-column flex'} style={{minWidth: '400px', overflowY: 'auto'}}>
//              <SectionTitle style={{marginBottom: '15px'}}>Meta</SectionTitle>
//              { hasFileMeta
//              ? <SimpleTable>
//                  <tr><td>Name</td><td>{fileMeta.data.name}</td></tr>
//                  <tr><td>Size</td><td>{formatBytes(fileMeta.data.size)}</td></tr>
//                  <tr><td>Last modified</td><td>{moment(fileMeta.data.modified).fromNow()}</td></tr>
//                  { revisions.length > 0
//                  ? <tr><td>Revisions</td><td>{revisions.length}</td></tr>
//                  : null }
//                </SimpleTable>
//              : null }
//              { hasFileMeta ? <AssemblyParts fileMeta={fileMeta} clickFn={this.clickCrumb}/> : null }
//              { relatedThreads && relatedThreads.data && relatedThreads.data.length > 0
//              ? <div>
//                  <SectionTitle style={{margin: '30px 0 15px'}}>Related Threads</SectionTitle>
//                  {orderBy(relatedThreads.data, ['complete']).map(thread => <Tag key={thread._id} text={thread.name} onClick={() => this.clickTag(thread)} />)}
//                </div>
//              : null }
//              <SectionTitle style={{margin: '30px 0'}}>Timeline</SectionTitle>
//              <div className="flex layout-column">
//                <TimelineVertical
//                  items={syncTimeline && syncTimeline.data ? syncTimeline.data : []}
//                />
//              </div>
//            </aside>
//          </DragResize>
//        </div>
//      </div>
//    );
//  }
// });
//
//
// ///////////////////////////////// CONTAINER /////////////////////////////////
//
// function mapStateToProps({ syncTimeline, files }, { fileMeta }) {
//  const hasFileId = fileMeta && fileMeta.data && fileMeta.data.fileId;
//  return {
//    syncTimeline: hasFileId ? syncTimeline[fileMeta.data.fileId] : [],
//    relatedThreads: hasFileId ? files.relatedThreads[fileMeta.data.fileId] : []
//  };
// }
//
// function mapDispatchToProps(dispatch) {
//  return {
//    syncTimelineActions: bindActionCreators(SyncTimelineActions, dispatch),
//    filesActions: bindActionCreators(FilesActions, dispatch),
//    dispatch
//  }
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(Component);
