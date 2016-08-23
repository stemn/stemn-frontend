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
    this.props.FileListActions.fetchFiles({
      projectId: this.props.projectId,
      path: this.props.path,
    });
  },

  componentWillReceiveProps(nextProps) {
    if(this.props.path != nextProps.path || this.props.projectId != nextProps.projectId){
      this.props.FileListActions.fetchFiles({
        projectId: nextProps.projectId,
        path: nextProps.path,
      });
    }
  },

  render() {
    const {files, singleClickFn, doubleClickFn, crumbClickFn, selected, options} = this.props;
    const crumbs = [
      {
        text: 'HOME',
      },{
        text: 'STEMN',
      },{
        text: 'FOLDER',
      }
    ]

    const filesFiltered = options.foldersOnly && files.data && files.data.length > 0 ? files.data.filter((file)=>file.type == 'folder') : files.data;

    return (
      <div>
        <div className={classes.breadcrumbs}>
          <FileBreadCrumbs crumbs={crumbs} clickFn={crumbClickFn}/>
        </div>
        <div className="rel-box" style={{minHeight: '200px'}}>
        {filesFiltered && filesFiltered.length > 0
          ? filesFiltered.map((file)=><FileRow file={file} singleClick={singleClickFn} doubleClick={doubleClickFn} isActive={selected && selected.fileId == file.fileId}/>)
          : <LoadingOverlay />
        }
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
    files: fileList[`${projectId}/${path}`],
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
