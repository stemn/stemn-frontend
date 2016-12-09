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
import FileBreadCrumbs  from './components/FileBreadCrumbs';
import FileRow          from './components/FileRow';
import LoadingOverlay   from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import MdRefresh        from 'react-icons/md/refresh';
import MdHome           from 'react-icons/md/home';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  onMount(nextProps, prevProps) {
    if(!prevProps || nextProps.path !== prevProps.path){
      this.getFiles({
        path     : nextProps.path,
        provider : nextProps.options.explore,
        projectId: nextProps.projectId,
      })
    }
  },
  getFiles({path, provider, projectId}) {
    if(['dropbox', 'drive'].includes(provider)){
      this.props.FileListActions.exploreFolder({
        provider: provider,
        folderId: path,
      });
    }
    else if(projectId){
      this.props.FileListActions.fetchFiles({
        projectId: projectId,
        path: path,
      });
    }
  },

  render() {
    const {files, singleClickFn, doubleClickFn, crumbClickFn, selected, options, path, projectId} = this.props;

    const displayResults = () => {
      const filesFiltered = options.foldersOnly && files.entries && files.entries.length > 0 ? files.entries.filter((file)=>file.type == 'folder') : files.data;
      if(filesFiltered && filesFiltered.length > 0){
        return filesFiltered.map((file)=><FileRow key={file.fileId} file={file} singleClick={singleClickFn} doubleClick={doubleClickFn} isActive={selected && selected.fileId == file.fileId}/>)
      }
      else{
        return <div style={{padding: '15px'}}>No results</div>
      }
    };

    const getFiles = () => {
      this.getFiles({
        path: path,
        provider: options.explore,
        projectId: projectId
      })
    }    

    const isLoading = !files || files.loading;

    return (
      <div>
        <div className={classes.breadcrumbs + ' layout-row layout-align-start-center'}>
          <FileBreadCrumbs className="flex" meta={files && files.folder ? files.folder : ''} clickFn={crumbClickFn}/>
          <SimpleIconButton onClick={() => crumbClickFn({file:{fileId: ''}})} title="Home">
            <MdHome size="22px"></MdHome>
          </SimpleIconButton>          
          <SimpleIconButton onClick={getFiles} title="Refresh">
            <MdRefresh size="22px"></MdRefresh>
          </SimpleIconButton>
        </div>
        <div className="rel-box" style={{height: '300px', overflowY: 'auto'}}>
          <LoadingOverlay show={isLoading} linear={true} hideBg={true}/>
          {!isLoading ? displayResults() :  ''}
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
