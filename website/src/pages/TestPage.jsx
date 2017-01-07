// Container Core
import { bindActionCreators } from 'redux';
import { connect, Provider } from 'react-redux';
import wrapProvider from 'website/src/app/redux/wrapProvider.js';

// Component Core
import React, { PropTypes } from 'react';
import { has } from 'lodash';

// Actions
import * as FilesActions from 'electron/app/shared/modules/Files/Files.actions.js';
import * as SyncTimelineActions from 'electron/app/shared/modules/SyncTimeline/SyncTimeline.actions.js';

// Sub Components
import LoadingOverlay       from 'electron/app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import cloudMagnify         from 'electron/app/renderer/assets/images/pure-vectors/cloud-magnify.svg';
import { orderItemsByTime } from 'electron/app/renderer/main/modules/FileCompare/FileCompare.utils.js';
import FileBreadCrumbs      from 'electron/app/renderer/main/modules/FileList/components/FileBreadCrumbs.jsx';
import Timeline             from 'electron/app/renderer/main/modules/Timeline/Timeline.jsx';
import AssemblyParts        from 'electron/app/shared/modules/Files/PreviewFile/PreviewCad/AssemblyParts/AssemblyParts.jsx'
import FileCompareInner     from 'electron/app/renderer/main/modules/FileCompare/FileCompareInner/FileCompareInner.jsx';
import FileCompareMenu      from 'electron/app/renderer/main/modules/FileCompare/FileCompareMenu';
import Header               from 'electron/app/renderer/main/modules/Header/Header.jsx'
import DragResize           from 'electron/app/renderer/main/modules/DragResize/DragResize.jsx';
import SectionTitle         from 'electron/app/shared/modules/Titles/SectionTitle/SectionTitle.jsx';
import SimpleTable          from 'electron/app/shared/modules/Tables/SimpleTable/SimpleTable.jsx';
import classes              from './TestPage.css'


///////////////////////////////// COMPONENT /////////////////////////////////

const propTypes = {
  params  : PropTypes.object.isRequired,
};

export const TestPage = React.createClass({
  // Mounting
  onMount(nextProps, prevProps){
    const hasFileMeta    = has(nextProps, 'fileMeta.data') && !nextProps.fileMeta.loading;
    const string1        = prevProps ? prevProps.localPath + prevProps.projectId + prevProps.fileId + prevProps.revisionId : '';
    const string2        = nextProps ? nextProps.localPath + nextProps.projectId + nextProps.fileId + nextProps.revisionId : '';
    const hasChangedFile = string1 != string2;

    if(string1 != string2){
      // If localPath exists - we must get the fileId - this will get the meta
      if(nextProps.localPath){
        nextProps.filesActions.getMetaFromPath({
          path       : nextProps.localPath
        })
      }
      // If we do not yet have the meta, get it:
      else if(!hasFileMeta){
        nextProps.filesActions.getMeta({
          projectId  : nextProps.projectId,
          fileId     : nextProps.fileId,
          revisionId : nextProps.revisionId
        });
      }
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

function mapStateToProps({files}, {params}) {
  let { localPath, revisionId, fileId, projectId } = params;
  fileId = fileId || (files.pathToId[localPath] ? files.pathToId[localPath].data : '');
  const cacheKey = localPath ? fileId : `${fileId}-${revisionId}`;
  return {
    localPath,
    fileId,
    revisionId,
    projectId,
    fileMeta: files.fileMeta[cacheKey],
  }
}

function mapDispatchToProps(dispatch) {
  return {
    filesActions: bindActionCreators(FilesActions, dispatch),
    syncTimelineActions: bindActionCreators(SyncTimelineActions, dispatch),
  }
}

export default wrapProvider(connect(mapStateToProps, mapDispatchToProps)(TestPage), propTypes);