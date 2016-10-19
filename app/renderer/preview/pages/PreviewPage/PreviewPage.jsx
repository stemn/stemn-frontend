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

// Styles
import classes from './PagePreview.css';

///////////////////////////////// COMPONENT /////////////////////////////////

export const InnerComponent = React.createClass({
  getInitialState () {
    return {
      selected1: this.props.syncTimeline.data[0],
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
    const items = mode == 'single' ? [selected1, selected1] : orderBy([selected1, selected2], item => (new Date(item.timestamp)).getTime());

    const revisions = syncTimeline && syncTimeline.data ? syncTimeline.data.filter(item => item.event == 'revision') : [];

    return (
      <div className="layout-column flex">
        <div className={classes.header + ' layout-row layout-align-start-center'}>
          <div className="flex">{fileMeta && fileMeta.data ? <FileBreadCrumbs meta={fileMeta.data} clickFn={this.clickCrumb}/> : ''}</div>
          <FileCompareMenu
            file1={items[1].data}
            file2={items[0].data}
            revisions={revisions}
            mode={mode}
            changeMode={this.changeMode}
          />
        </div>
        <div className="layout-row flex">
          <div className="layout-column flex">
            <FileCompareInner
              project={fileMeta.data.project}
              file1={items[1].data}
              file2={items[0].data}
              mode={mode} />
            <Timeline className={classes.timeline}
              items={revisions}
              onSelect={this.onSelect}
              isSelected={this.isSelected}
              preferPlace="above"/>
          </div>
          <DragResize side="left" width="450" widthRange={[0, 450]} className="layout-column">
            <aside className={classes.sidebar + ' flex'} style={{minWidth: '400px', overflowY: 'auto'}}>
              <SectionTitle style={{marginBottom: '15px'}}>Meta</SectionTitle>
              <SimpleTable>
                <tr><td>Name</td><td>{fileMeta.data.name}</td></tr>
                <tr><td>Size</td><td>{fileMeta.data.size}</td></tr>
                <tr><td>Last modified</td><td>{moment(fileMeta.data.modified).fromNow()}</td></tr>
                <tr><td>Revisions</td><td>{revisions.length}</td></tr>
              </SimpleTable>
              <SectionTitle style={{margin: '30px 0'}}>Timeline</SectionTitle>
              <TimelineVertical
                items={syncTimeline && syncTimeline.data ? syncTimeline.data : []}
              />
            </aside>
          </DragResize>
        </div>
      </div>
    );
  }
});

export const Component = React.createClass({

  // Mounting
  onMount(nextProps, prevProps){
    const { revisionId, fileId, projectId} = nextProps.params;

    // If we do not yet have the meta, get it:
    if(!nextProps.fileMeta || !nextProps.fileMeta.data && !nextProps.fileMeta.loading){
      nextProps.filesActions.getMeta({fileId, revisionId});
    }

    // If we don't have the timeline, get it:
    if(!nextProps.syncTimeline || !nextProps.syncTimeline.data && !nextProps.syncTimeline.loading){
      nextProps.syncTimelineActions.fetchTimeline({projectId, fileId })
    }
  },
  componentWillMount() { this.onMount(this.props) },

  render() {
    const { fileMeta, syncTimeline } = this.props;
    return (
      <div className="layout-column flex">
        {
          fileMeta && syncTimeline && syncTimeline.data
          ? <InnerComponent fileMeta={fileMeta} syncTimeline={syncTimeline}/>
          : null
        }
        <LoadingOverlay show={!fileMeta || !syncTimeline}/>
      </div>
    );
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({files, syncTimeline}, {params}) {
  const cacheKey = `${params.fileId}-${params.revisionId}`
  return {
    fileMeta: files.fileMeta[cacheKey],
    syncTimeline: syncTimeline[params.fileId]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    filesActions: bindActionCreators(FilesActions, dispatch),
    syncTimelineActions: bindActionCreators(SyncTimelineActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
