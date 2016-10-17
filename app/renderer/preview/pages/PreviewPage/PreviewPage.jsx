// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Actions
import * as FilesActions from 'app/renderer/main/modules/Files/Files.actions.js';
import * as SyncTimelineActions from 'app/shared/modules/SyncTimeline/SyncTimeline.actions.js';

// Sub Components
import FileCompareInner     from 'app/renderer/main/modules/FileCompare/FileCompareInner/FileCompareInner.jsx';
import Timeline           from 'app/renderer/main/modules/Timeline/Timeline.jsx';
import DragResize         from 'app/renderer/main/modules/DragResize/DragResize.jsx';
import FileBreadCrumbs    from 'app/renderer/main/modules/FileList/components/FileBreadCrumbs.jsx'
import FileCompareMenu    from 'app/renderer/main/modules/FileCompare/FileCompareMenu/FileCompareMenu.jsx';

// Styles
import classes from './PagePreview.css';

import { orderBy }        from 'lodash';


///////////////////////////////// COMPONENT /////////////////////////////////

const onMount = (nextProps, prevProps) => {
  const { revisionId, fileId} = nextProps.params;

  // If we do not yet have the meta, get it:
  if(!nextProps.fileMeta || !nextProps.fileMeta.data && !nextProps.fileMeta.loading
     && fileId){
    nextProps.filesActions.getMeta({fileId, revisionId});
  }

  // If we don't have the timeline (and we can get it), get it:
  if(!nextProps.syncTimeline || !nextProps.syncTimeline.loading && nextProps.fileMeta && nextProps.fileMeta.data &&
     (!prevProps || nextProps.fileMeta.data._id != prevProps.fileMeta.data._id)){
    nextProps.syncTimelineActions.fetchTimeline({
      projectId: nextProps.fileMeta.data.project._id,
      fileId: nextProps.fileMeta.data._id
    })
  }
}

//selected={timeline && timeline.selected ? timeline.selected._id : ''}
export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},

  getInitialState () {
    return {
      selected1: this.props.syncTimeline.data[0],
      selected2: this.props.syncTimeline.data[1],
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
//    if(item.event == 'commit'){
//      return item.data.items.findIndex(commitItem => commitItem.data.revisionId == this.props.fileMeta.data.revisionId) != -1;
//    }
//    else{
//      return item.data.revisionId == this.props.fileMeta.data.revisionId;
//    }
    const selected1 = item.data.revisionId == this.state.selected1.data.revisionId;
    const selected2 = item.data.revisionId == this.state.selected2.data.revisionId;

    return this.state.mode == 'single' ? selected1 : selected1 || selected2;
  },
  render() {
    const { fileMeta, syncTimeline } = this.props;
    const { mode, selected1, selected2 } = this.state;
    const items = mode == 'single' ? [selected1, selected1] : orderBy([selected1, selected2], item => (new Date(item.timestamp)).getTime());

    return (
      <div className="layout-column flex">
        <div className={classes.header + ' layout-row layout-align-start-center'}>
          <div className="flex">{fileMeta && fileMeta.data ? <FileBreadCrumbs meta={fileMeta.data} clickFn={this.clickCrumb}/> : ''}</div>
          <FileCompareMenu
            file1={items[1].data}
            file2={items[0].data}
            revisions={syncTimeline.data}
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
              items={syncTimeline && syncTimeline.data ? syncTimeline.data : []}
              onSelect={this.onSelect}
              isSelected={this.isSelected}
              preferPlace="above"/>
          </div>
          <DragResize side="left" width="450" widthRange={[0, 450]} className="layout-column">
            <aside className={classes.sidebar + ' layout-column flex'}>
              Lorem goes in here
            </aside>
          </DragResize>
        </div>
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
