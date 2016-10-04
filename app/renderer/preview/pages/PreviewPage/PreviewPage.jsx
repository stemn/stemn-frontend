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
import FileCompare        from 'app/renderer/main/modules/FileCompare/FileCompare.jsx';
import FileCompareHeader  from 'app/renderer/main/modules/FileCompare/FileCompareHeader/FileCompareHeader.jsx';
import Timeline           from 'app/renderer/main/modules/Timeline/Timeline.jsx';
import DragResize         from 'app/renderer/main/modules/DragResize/DragResize.jsx';
import FileBreadCrumbs    from 'app/renderer/main/modules/FileList/components/FileBreadCrumbs.jsx'
// Styles
import classes from './PagePreview.css';

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

  clickCrumb({file}){
    console.log(file);
  },
  clickTimeline(response){
    console.log(response);
  },
  isSelected(item){
    if(item.event == 'commit'){
      return item.data.items.findIndex(commitItem => commitItem.data.revisionId == this.props.fileMeta.data.revisionId) != -1;
    }
    else{
      return item.data.revisionId == this.props.fileMeta.data.revisionId;
    }
  },
  render() {
    const { fileMeta, syncTimeline } = this.props;

    return (
      <div className="layout-column flex">
        <div className={classes.header}>
          {fileMeta && fileMeta.data ? <FileBreadCrumbs meta={fileMeta.data} clickFn={this.clickCrumb}/> : ''}
        </div>
        <div className="layout-row flex">
          <div className="layout-column flex">
            {
              fileMeta && fileMeta.data
              ? <div className="layout-column flex">
                  <FileCompare
                    compareId={`preview-${fileMeta.data.fileId}}`}
                    project={fileMeta.data.project}
                    file1={fileMeta.data}/>
                </div>
              : ''
            }
            <Timeline className={classes.timeline}
              items={syncTimeline && syncTimeline.data ? syncTimeline.data : []}
              onSelect={this.clickTimeline}
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
