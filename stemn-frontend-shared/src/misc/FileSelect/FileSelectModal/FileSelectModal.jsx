import React from 'react'
import PropTypes from 'prop-types'
import classes from './FileSelectModal.scss'

import FileList from 'stemn-shared/misc/FileList'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import { isDriveFileId, isDropboxFileId } from 'stemn-shared/misc/Files/utils'


// Either a projectId or options.explore must be defined
const propTypesObject = {
  projectId: PropTypes.string,               // Optional: The project id (this is used if we are not exploring a provider)
  path: PropTypes.string,               // The current fileId: This folder will be opened when the modal inits.
  model: PropTypes.string,               // The { fileId, path } will be assigned to this model on confirm
  storeKey: PropTypes.string.isRequired,    // The store key (to be used in the redicer)
  options: PropTypes.shape({
    allowFolder: PropTypes.bool,
    foldersOnly: PropTypes.bool,
    explore: PropTypes.string,         // Optional: 'dropbox' || 'drive' - The provider
  }),
}

export default class FileSelectModal extends React.Component {
  static propTypes = propTypesObject;
  componentWillMount() { this.onMount(this.props) }
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props) }

  onMount = (nextProps, prevProps) => {
    if (!nextProps.fileSelect) {
      nextProps.init({
        storeKey: nextProps.storeKey,
        path: nextProps.path,
      })
    }
  };

  singleClickFn = ({ file }) => {
    if (file.type === 'file' || this.props.options.allowFolder && file.type === 'folder') {
      this.props.select({
        storeKey: this.props.storeKey,
        file,
      })
    } else {
      this.props.changePath({
        storeKey: this.props.storeKey,
        path: file.fileId,
      })
    }
  };

  doubleClickFn = ({ file }) => {
    if (file.type === 'folder') {
      this.props.changePath({
        storeKey: this.props.storeKey,
        path: file.fileId,
      })
    } else {
      this.props.select({
        storeKey: this.props.storeKey,
        file,
      })
    }
  };

  crumbClickFn = ({ file }) => {
    this.props.changePath({
      storeKey: this.props.storeKey,
      path: file.fileId,
    })
  };

  submit = () => {
    this.props.storeChange(this.props.model, {
      fileId: this.props.fileSelect.selected.fileId,
      path: this.props.fileSelect.selected.path,
    })
    this.props.modalConfirm()
  };

  cancel = () => {
    this.props.modalCancel()
  };

  render() {
    const {
      projectId,
      fileSelect,
      options,
    } = this.props

    const validatePath = (path, provider) => {
      if (provider === 'drive') {
        return isDriveFileId(path) ? path : ''
      } else if (provider === 'dropbox') {
        return isDropboxFileId(path) ? path : ''
      }
      
      return ''
    }
    const activePath = fileSelect ? validatePath(fileSelect.path, options.explore) : ''

    return (
      <div className={ classes.modal }>
        { fileSelect &&
          <FileList
            projectId={ projectId }
            path={ activePath }
            singleClickFn={ this.singleClickFn }
            doubleClickFn={ this.doubleClickFn }
            crumbClickFn={ this.crumbClickFn }
            selected={ fileSelect.selected }
            options={ options }
            contentStyle={ { height: '300px', overflowY: 'auto' } }
          /> }
        <div className="modal-footer layout-row layout-align-start-center">
          <div className="flex text-grey-3">
            { fileSelect && fileSelect.selected && fileSelect.selected.path
              ? <span>Selected: {fileSelect.selected.path}</span>
              : null }
          </div>
          <Button style={ { marginRight: '10px' } } onClick={ this.cancel }>
            Cancel
          </Button>
          <Button className="primary" onClick={ this.submit }>
            Select Folder
          </Button>
        </div>
      </div>
    )
  }
}
