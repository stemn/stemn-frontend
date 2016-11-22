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
import * as FilesActions from 'app/renderer/main/modules/Files/Files.actions.js';
import * as SyncTimelineActions from 'app/shared/modules/SyncTimeline/SyncTimeline.actions.js';

// Sub Components
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
    // If we don't have the timeline, get it:
    if(!nextProps.syncTimeline || !nextProps.syncTimeline.data && !nextProps.syncTimeline.loading){
      if(nextProps.fileMeta.project && nextProps.fileMeta.project._id){
        nextProps.syncTimelineActions.fetchTimeline({
          projectId : nextProps.fileMeta.project._id,
          fileId    : nextProps.fileMeta.fileId,
        })
      }
      else{
        nextProps.syncTimelineActions.fetchTimeline({
          fileId    : nextProps.fileMeta.fileId,
        })
      }
      nextProps.filesActions.getRelatedTasks({
        fileId    : nextProps.fileMeta.fileId
      })
    }
  },
  componentWillMount() { this.onMount(this.props) },
  getInitialState () {
    return {
      selected1: this.props.fileMeta,
      selected2: null,
      lastSelected: 1,
      mode: 'single'
    }
  },
  onSelect(response){
    if(this.state.mode == 'single'){
      this.setState({
        selected1: response,
        lastSelected: 1
      })
    }
    else{
      if(this.state.lastSelected == 1){
        this.setState({
          selected2: response,
          lastSelected: 2
        })
      }
      else{
        this.setState({
          selected1: response,
          lastSelected: 1
        })
      }
    }
  },
  changeMode(mode){
    this.setState({mode: mode})
  },
  clickCrumb({file}){
    console.log(file);
  },
  isSelected(item){
    const selected1 = has(this.state, 'selected1.data.revisionId') ? item.data.revisionId == this.state.selected1.data.revisionId : false;
    const selected2 = has(this.state, 'selected2.data.revisionId') ? item.data.revisionId == this.state.selected2.data.revisionId : false;
    return this.state.mode == 'single' ? selected1 : selected1 || selected2;
  },
  render() {
    const { fileMeta, syncTimeline } = this.props;
    const { mode, selected1, selected2 } = this.state;
    const isPartOfProject = fileMeta.project && fileMeta.project._id;
    const items = mode == 'single' ? [selected1] : orderBy([selected1, selected2], item => (new Date(item.timestamp)).getTime());
    const file1 = items[0];
    const file2 = items[1] ? items[1].data : undefined;
    const revisions = syncTimeline && syncTimeline.data ? syncTimeline.data.filter(item => item.event == 'revision') : [];

    const taskTags = [
      {name:'This is the first task', completed: false},
      {name:'And the second task goes here', completed: true},
      {name:'There can be long tasks like this that get cut-off in the middle', completed: true},
      {name:'Or short', completed: false},
      {name:'And lots of tasks if required', completed: false},
    ];
    return (
      <div className="layout-column flex">
        <div className={classes.header + ' layout-row layout-align-start-center'}>
          <div className="flex">{fileMeta ? <FileBreadCrumbs meta={fileMeta} clickFn={this.clickCrumb}/> : ''}</div>
          <FileCompareMenu
            file1={file1}
            file2={file2}
            revisions={revisions}
            mode={mode}
            changeMode={this.changeMode}
          />
        </div>
        <div className="layout-row flex">
          <div className="layout-column flex">
            <FileCompareInner
              project={fileMeta.project}
              file1={file1}
              file2={file2}
              mode={mode} />
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
                <tr><td>Name</td><td>{fileMeta.name}</td></tr>
                <tr><td>Size</td><td>{formatBytes(fileMeta.size)}</td></tr>
                <tr><td>Last modified</td><td>{moment(fileMeta.modified).fromNow()}</td></tr>
                { revisions.length > 0 
                ? <tr><td>Revisions</td><td>{revisions.length}</td></tr> 
                : null }
              </SimpleTable>
              <div>
                <SectionTitle style={{margin: '30px 0 15px'}}>Related Tasks</SectionTitle>
                {orderBy(taskTags, ['completed']).map((task, index) => <Tag key={index} text={task.name} style={task.completed ? {opacity: '0.5'} : {}} />)}
              </div>
              <SectionTitle style={{margin: '30px 0'}}>Timeline</SectionTitle>
              <div className="flex">
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

function mapStateToProps({ syncTimeline }, { fileMeta }) {
  return {
    syncTimeline: syncTimeline[fileMeta.fileId]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    syncTimelineActions: bindActionCreators(SyncTimelineActions, dispatch),
    filesActions: bindActionCreators(FilesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
