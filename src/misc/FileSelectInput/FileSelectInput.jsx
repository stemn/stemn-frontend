import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// Container Actions
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js'
import fileSelectModalName from 'stemn-shared/misc/FileSelect/FileSelectModal'

import classes from './FileSelectInput.css'
import classNames from 'classnames'
import MdFolder from 'react-icons/md/folder'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import { isDriveFileId, isDropboxFileId } from 'stemn-shared/misc/Files/utils'
import TextDisplayBox from 'stemn-shared/misc/TextDisplayBox/TextDisplayBox.jsx'


const propTypesObject = {
  projectId: PropTypes.string,
  provider: PropTypes.string.isRequired,    // 'dropbox' || 'drive' - The provider
  model: PropTypes.string.isRequired,       // The model to assign the selected file
  value: PropTypes.object.isRequired,       // The value of the selected file: { path, fileId }
  disabled: PropTypes.bool                  // Should we disable the input
};

const FileSelectInput = React.createClass({
  showModal(){
    this.props.ModalActions.showModal({
      modalType: fileSelectModalName,
      modalProps: {
        projectId: this.props.projectId,
        model: this.props.model,
        path: this.props.value.fileId,
        storeKey: this.props.model, // We use the model as the storekey
        options: {
          allowFolder : true,
          foldersOnly : true,
          explore     : this.props.provider
        },
      },
    })
  },
  render() {
    const { provider, model, value, disabled } = this.props;

    const validatePath = (path, fileId, provider) => {
      if(provider == 'drive'){
        return isDriveFileId(fileId) ? path : '';
      }
      else if(provider == 'dropbox'){
        return isDropboxFileId(fileId) ? path : '';
      }
      else{
        return ''
      }
    }

    const path = validatePath(value.path, value.fileId, provider);

    return (
      <TextDisplayBox
        disabled={disabled}
        onClick={()=>{if(!disabled){this.showModal()}}}
      >
        <div className='flex'>
          {path ? <span><span style={{textTransform: 'capitalize'}}>{provider}/</span>{path}</span> : 'Select the project folder'}
        </div>
        <SimpleIconButton>
          <MdFolder size="22" />
        </SimpleIconButton>
      </TextDisplayBox>
    );
  }
});


function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    ModalActions: bindActionCreators(ModalActions, dispatch),
  }
}

FileSelectInput.propTypes = propTypesObject;

export default connect(mapStateToProps, mapDispatchToProps)(FileSelectInput);
