// Container Core
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// Container Actions
import * as FileListActions from '../FileList.actions.js'

// Component Core
import React from 'react'
import PropTypes from 'prop-types'
import { orderBy, omit } from 'lodash'

// Styles
import cn from 'classnames'
import classes from './FileListPopup.css'

// Sub Components
import LoadingOverlay   from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import FileIcon         from './FileIcon'

// /////////////////////////////// COMPONENT /////////////////////////////////

const propTypesObject = {
  meta: PropTypes.object.isRequired,
  parentfolder: PropTypes.object.isRequired,
  activeFolder: PropTypes.object.isRequired,
  isOpen: PropTypes.bool,  // From the popover component
  clickFn: PropTypes.func,
  files: PropTypes.object,
  FileListActions: PropTypes.object,      // Actions
  dispatch: PropTypes.func,        // Actions
}


export class FileRow extends React.Component {
  render() {
    const { file, isActive, clickFn } = this.props
    return (
      <div className={ cn(classes.file, { [classes.active]: isActive }, 'layout-row layout-align-start-center') } onClick={ () => clickFn({ file }) }>
        <FileIcon fileType={ file.extension } type={ file.type } size={ 20 } />
        <div className="text-ellipsis">{file.name}</div>
      </div>
    )
  }
}

export class FileListPopup extends React.Component {
  static propTypes = propTypesObject;

  //  componentWillMount() {
  //    this.onMount(this.props)
  //  },
  //  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  //  onMount(nextProps, prevProps) {
  //    if((!prevProps || !prevProps.isOpen) && nextProps.isOpen && (!nextProps.files || !nextProps.files.loading)){
  //      this.getFiles({
  //        path     : nextProps.parentfolder.fileId,
  //        projectId: nextProps.meta.project._id,
  //      })
  //    }
  //  },
  //  getFiles({path, provider, projectId}) {
  //    if(projectId){
  //      this.props.FileListActions.fetchFiles({
  //        projectId: projectId,
  //        path: path || '',
  //      });
  //    }
  //    else if(['dropbox', 'drive'].includes(provider)){
  //      this.props.FileListActions.exploreFolder({
  //        provider: provider,
  //        folderId: path || '',
  //      });
  //    }
  //  },

  render() {
    const {
      files,
      activeFolder,
      clickFn,
    } = this.props
    const isLoading    = !files || files.loading
    const filesOrdered = files && files.entries ? orderBy(files.entries, 'name') : []
    const filesOnly    = filesOrdered.filter(file => file.type === 'file')
    const foldersOnly  = filesOrdered.filter(file => file.type === 'folder')

    return (
      <div { ...omit(this.props, Object.keys(propTypesObject)) } className={ classes.popup }>
        <LoadingOverlay show={ isLoading } linear noOverlay />
        { foldersOnly && foldersOnly.map(file => (
          <FileRow
            key={ file._id }
            file={ file }
            isActive={ file.fileId === activeFolder.fileId }
            clickFn={ clickFn }
          />
        ))
        }
        { foldersOnly && filesOnly && <div className={ classes.divider } /> }
        { filesOnly && filesOnly.map(file => (
          <FileRow
            key={ file._id }
            file={ file }
            isActive={ file.fileId === activeFolder.fileId }
            clickFn={ clickFn }
          />
        ))
        }
      </div>
    )
  }
}


// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ fileList }, { parentfolder, meta }) {
  const cacheString = meta.project._id  ?  `${meta.project._id}-${parentfolder.fileId || ''}` : `${meta.provider}-${parentfolder.fileId || ''}`
  return {
    files: fileList[cacheString],
  }
}

function mapDispatchToProps(dispatch) {
  return {
    FileListActions: bindActionCreators(FileListActions, dispatch),
    dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileListPopup)
