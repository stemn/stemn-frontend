// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as FileListActions from './FileList.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './FileList.css'

// Sub Components
import FileBreadCrumbs from './components/FileBreadCrumbs';
import FileRow from './components/FileRow';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  componentWillMount() {
    if(this.props.options.explore == 'drive' || this.props.options.explore == 'dropbox'){
      this.props.FileListActions.exploreFolder({
        provider: this.props.options.explore,
        folderId: this.props.path,
      });
    }
    else{
      this.props.FileListActions.fetchFiles({
        projectId: this.props.projectId,
        path: this.props.path,
      });
    }
  },

  componentWillReceiveProps(nextProps) {
    if(this.props.path != nextProps.path || this.props.projectId != nextProps.projectId){
      if(nextProps.options.explore == 'drive' || nextProps.options.explore == 'dropbox'){
        this.props.FileListActions.exploreFolder({
          provider: nextProps.options.explore,
          folderId: nextProps.path,
        });
      }
      else{
        this.props.FileListActions.fetchFiles({
          projectId: nextProps.projectId,
          path: nextProps.path,
        });
      }
    }
  },

  render() {
    const {files, singleClickFn, doubleClickFn, crumbClickFn, selected, options} = this.props;

    const displayResults = () => {
      const filesFiltered = options.foldersOnly && files.entries && files.entries.length > 0 ? files.entries.filter((file)=>file.type == 'folder') : files.data;
      if(filesFiltered && filesFiltered.length > 0){
        return filesFiltered.map((file)=><FileRow key={file.fileId} file={file} singleClick={singleClickFn} doubleClick={doubleClickFn} isActive={selected && selected.fileId == file.fileId}/>)
      }
      else{
        return <div style={{padding: '15px'}}>No results</div>
      }
    }

    return (
      <div>
        <div className={classes.breadcrumbs}>
          <FileBreadCrumbs meta={files && files.folder ? files.folder : ''} clickFn={crumbClickFn}/>
        </div>
        <div className="rel-box" style={{height: '300px', overflowY: 'auto'}}>
          {files && !files.loading ? displayResults() :  ''}
          <LoadingOverlay show={!files || files.loading} linear={true} hideBg={true}/>
        </div>
      </div>
    );
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({fileList}, {projectId, path, singleClickFn, doubleClickFn, crumbClickFn, options}) {

  return {
    files: options.explore == 'drive' || options.explore == 'dropbox' ? fileList[`${options.explore}-${path}`] : fileList[`${projectId}-${path}`],
    projectId,
    path,
    singleClickFn,
    doubleClickFn,
    crumbClickFn,
    options
  };
}

function mapDispatchToProps(dispatch) {
  return {
    FileListActions: bindActionCreators(FileListActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
