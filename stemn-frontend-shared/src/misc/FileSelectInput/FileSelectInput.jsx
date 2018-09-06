import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// Container Actions
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js'
import fileSelectModalName from 'stemn-shared/misc/FileSelect/FileSelectModal'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'

import classes from './FileSelectInput.css'
import MdFolder from 'react-icons/md/folder'
import MdNewFolder from 'react-icons/md/create-new-folder'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import { isDriveFileId, isDropboxFileId } from 'stemn-shared/misc/Files/utils'
import TextDisplayBox from 'stemn-shared/misc/TextDisplayBox/TextDisplayBox.jsx'


const propTypesObject = {
  projectId: PropTypes.string,
  provider: PropTypes.string.isRequired,    // 'dropbox' || 'drive' - The provider
  model: PropTypes.string.isRequired,       // The model to assign the selected file
  value: PropTypes.object.isRequired,       // The value of the selected file: { path, fileId }
  disabled: PropTypes.bool,                  // Should we disable the input
}

class FileSelectInput extends React.Component {
  showModal = () => {
    this.props.ModalActions.showModal({
      modalType: fileSelectModalName,
      modalProps: {
        projectId: this.props.projectId,
        model: this.props.model,
        path: this.props.value.fileId,
        storeKey: `${this.props.model}-${this.props.provider}`,
        // We use the model + provider as the storekey.
        // This means items from the last provider don't show in the modal.
        options: {
          allowFolder: true,
          foldersOnly: true,
          explore: this.props.provider,
        },
      },
    })
  };

  clearValue = () => {
    const { storeChange, model } = this.props
    storeChange(model, {
      path: undefined,
      fileId: undefined,
    })
  };

  render() {
    const {
      provider,
      value,
      disabled,
    } = this.props

    const validatePath = (path, fileId, provider) => {
      if (provider === 'drive') {
        return isDriveFileId(fileId) ? path : ''
      } else if (provider === 'dropbox') {
        return isDropboxFileId(fileId) ? path : ''
      }
      
      return ''
    }

    const path = validatePath(value.path, value.fileId, provider)

    const getInnerText = () => {
      if (path) {
        return <span><span style={ { textTransform: 'capitalize' } }>{ provider }/</span>{ path }</span>
      } else if (value.path === undefined && value.fileId === undefined && provider) {
        return `A new folder will be created in your ${provider}`
      } 
      return 'Select the project folder'
    }

    return (
      <TextDisplayBox
        disabled={ disabled }
      >
        <div className="layout-row flex layout-align-start-center" onClick={ () => { if (!disabled) { this.showModal() } } }>
          <div className="flex">
            { getInnerText() }
          </div>
          <SimpleIconButton title="Select folder">
            <MdFolder size="22" />
          </SimpleIconButton>
        </div>
        <SimpleIconButton
          className={ classes.newFolderIcon }
          onClick={ this.clearValue }
          title="New Folder"
        >
          <MdNewFolder size="22" />
        </SimpleIconButton>
      </TextDisplayBox>
    )
  }
}


function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    ModalActions: bindActionCreators(ModalActions, dispatch),
    storeChange: bindActionCreators(storeChange, dispatch),
  }
}

FileSelectInput.propTypes = propTypesObject

export default connect(mapStateToProps, mapDispatchToProps)(FileSelectInput)
