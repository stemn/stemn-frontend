// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Functions
import { orderBy, has }        from 'lodash';
import moment from 'moment';
import { formatBytes } from 'app/renderer/main/modules/Files/Files.utils.js'

// Actions
import * as FilesActions        from 'app/renderer/main/modules/Files/Files.actions.js';
import * as SyncTimelineActions from 'app/shared/modules/SyncTimeline/SyncTimeline.actions.js';
import * as ModalActions        from 'app/renderer/main/modules/Modal/Modal.actions.js';
import * as ElectronWindowsActions from 'app/shared/modules/ElectronWindows/ElectronWindows.actions.js';
import { push } from 'react-router-redux';


// Sub Components
import { orderItemsByTime } from 'app/renderer/main/modules/FileCompare/FileCompare.utils.js';
import FileCompareInner   from 'app/renderer/main/modules/FileCompare/FileCompareInner/FileCompareInner.jsx';
import Timeline           from 'app/renderer/main/modules/Timeline/Timeline.jsx';
import DragResize         from 'app/renderer/main/modules/DragResize/DragResize.jsx';
import FileBreadCrumbs    from 'app/renderer/main/modules/FileList/components/FileBreadCrumbs.jsx'
import FileCompareMenu    from 'app/renderer/main/modules/FileCompare/FileCompareMenu/FileCompareMenu.jsx';
import LoadingOverlay     from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import TimelineVertical   from 'app/shared/modules/TimelineVertical/TimelineVertical.jsx';
import SimpleTable        from 'app/shared/modules/Tables/SimpleTable/SimpleTable.jsx';
import SectionTitle       from 'app/shared/modules/Titles/SectionTitle/SectionTitle.jsx';
import Tag                from 'app/shared/modules/Tags/Tag.jsx';


// Styles
import classes from './PagePreview.css';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
    // Mounting
  onMount(nextProps, prevProps){
    // If this is a sync file
    if(nextProps.fileMeta.data.project && nextProps.fileMeta.data.project._id){
      nextProps.syncTimelineActions.fetchTimeline({
        projectId : nextProps.fileMeta.data.project._id,
        fileId    : nextProps.fileMeta.data.fileId,
      })
    }
    // If this is remote file
    else{
      nextProps.syncTimelineActions.fetchTimeline({
        fileId    : nextProps.fileMeta.data.fileId,
        provider  : nextProps.fileMeta.data.provider,
      })
    }
    nextProps.filesActions.getRelatedTasks({
      fileId    : nextProps.fileMeta.data.fileId,
      projectId : nextProps.fileMeta.data.project._id
    })
  },
  componentWillMount() { this.onMount(this.props) },
  getInitialState () {
    return {
      selected1    : this.props.fileMeta,
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
    dispatch(push({
      pathname: `/project/${fileMeta.data.project._id}/files/${file.fileId}`,
      state: {meta : {scope: ['main']}}
    }))
    dispatch(ElectronWindowsActions.show('main'))
  },
  clickTag(task){
    this.props.dispatch(ModalActions.showModal({modalType: 'TASK', modalProps: { taskId: task._id }}));
    this.props.dispatch(ElectronWindowsActions.show('main'))
  },
  render() {
    const { fileMeta, syncTimeline, relatedTasks } = this.props;
    const { mode, selected1, selected2 } = this.state;
    const isPartOfProject = fileMeta.data.project && fileMeta.data.project._id;
    const items = orderItemsByTime(mode, selected1, selected2);
    const file1 = items[0] ? items[0].data : undefined;
    const file2 = items[1] ? items[1].data : undefined;
    const revisions = syncTimeline && syncTimeline.data ? syncTimeline.data.filter(item => item.event == 'revision') : [];
    
    return (
      <div className="layout-column flex">
        <div className={classes.header + ' layout-row layout-align-start-center'}>
          <div className="flex">{fileMeta ? <FileBreadCrumbs meta={fileMeta.data} clickFn={this.clickCrumb}/> : ''}</div>
          <FileCompareMenu
            file1={file1}
            file2={file2}
            revisions={revisions}
            mode={mode}
            changeMode={this.changeMode}
          />
          <div className={classes.divider}></div>
        </div>
        <div className="layout-row flex">
          <div className="layout-column flex">
            <FileCompareInner
              project={fileMeta.data.project}
              file1={file1}
              file2={file2}
              mode={mode}
              header={['sideBySide', 'aboveAndBelow'].includes(mode)}/>
            <Timeline className={classes.timeline}
              items={revisions}
              onSelect={this.onSelect}
              isSelected={this.isSelected}
              preferPlace="above"/>
          </div>
          <DragResize side="left" width="450" widthRange={[0, 450]} className="layout-column">
            <aside className={classes.sidebar + ' layout-column flex'} style={{minWidth: '400px', overflowY: 'auto'}}>
              <SectionTitle style={{marginBottom: '15px'}}>Meta</SectionTitle>
              <SimpleTable>
                <tr><td>Name</td><td>{fileMeta.data.name}</td></tr>
                {/*<tr><td>Projects</td><td>{fileMeta.data.project._id}</td></tr>*/}
                <tr><td>Size</td><td>{formatBytes(fileMeta.data.size)}</td></tr>
                <tr><td>Last modified</td><td>{moment(fileMeta.data.modified).fromNow()}</td></tr>
                { revisions.length > 0 
                ? <tr><td>Revisions</td><td>{revisions.length}</td></tr> 
                : null }
              </SimpleTable>
              { relatedTasks && relatedTasks.data && relatedTasks.data.length > 0
              ? <div>
                  <SectionTitle style={{margin: '30px 0 15px'}}>Related Tasks</SectionTitle>
                  {orderBy(relatedTasks.data, ['complete']).map(task => <Tag key={task._id} text={task.name} onClick={() => this.clickTag(task)} />)}
                </div>
              : null }
              <SectionTitle style={{margin: '30px 0'}}>Timeline</SectionTitle>
              <div className="flex layout-column">
                <TimelineVertical
                  items={syncTimeline && syncTimeline.data ? syncTimeline.data : []}
                />
              </div>
            </aside>
          </DragResize>
        </div>
      </div>
    );
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ syncTimeline, files }, { fileMeta }) {
  return {
    syncTimeline: syncTimeline[fileMeta.data.fileId],
    relatedTasks: files.relatedTasks[fileMeta.data.fileId]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    syncTimelineActions: bindActionCreators(SyncTimelineActions, dispatch),
    filesActions: bindActionCreators(FilesActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
