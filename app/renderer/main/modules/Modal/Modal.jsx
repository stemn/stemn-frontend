// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import i from 'icepick';

// Container Actions
import * as ModalActions from './Modal.actions.js';

// Component Core
import React from 'react';
import Modal from 'react-modal';

// Styles
import classNames from 'classnames';
import classes from './Modal.css'

// Modals
import ConfirmModal           from './modals/ConfirmModal.jsx';
import ErrorModal             from './modals/ErrorModal.jsx';
import ConnectionModal        from './modals/ConnectionModal.jsx';
import ProviderAccessError    from './modals/ProviderAccessErrorModal.jsx'
import ProviderAccessRevoked  from './modals/ProviderAccessRevokedModal.jsx'
import ReleaseNotesModal      from './modals/ReleaseNotesModal.jsx'
import FileSelectModal        from 'app/renderer/main/modules/FileSelect/FileSelectModal.jsx';
import TaskDisplayModal       from 'app/renderer/main/modules/Tasks/TaskDisplayModal/TaskDisplayModal.jsx'
import TaskLabelsEditModal    from 'app/renderer/main/modules/Tasks/TaskLabelsEditModal/TaskLabelsEditModal.jsx'
import TaskMentionModal       from 'app/renderer/main/modules/Mentions/TaskMentionModal/TaskMentionModal.jsx'
import ProjectNewModal        from 'app/renderer/main/modules/Projects/ProjectNewModal/ProjectNewModal.jsx'
import FileDownload           from 'app/renderer/main/modules/Files/Download/DownloadModal/DownloadModal.jsx'
import PreviewExpired         from 'app/renderer/main/modules/Files/PreviewFile/Messages/PreviewExpired/PreviewExpiredModal.jsx'
import AssemblyPartNotFound   from 'app/renderer/main/modules/Files/PreviewFile/Messages/AssemblyPartNotFound/AssemblyPartNotFoundModal.jsx'
  

const modalComponents = {
  'CONFIRM'                 : ConfirmModal,
  'ERROR'                   : ErrorModal,
  'CONNECTION'              : ConnectionModal,
  'FILE_SELECT'             : FileSelectModal,
  'TASK'                    : TaskDisplayModal,
  'TASK_LABELS'             : TaskLabelsEditModal,
  'TASK_COMMIT'             : TaskMentionModal,
  'PROJECT_NEW'             : ProjectNewModal,
  'PROVIDER_ACCESS_ERROR'   : ProviderAccessError,
  'PROVIDER_ACCESS_REVOKED' : ProviderAccessRevoked,
  'RELEASE_NOTES'           : ReleaseNotesModal,
  'FILE_DOWNLOAD'           : FileDownload,
  'PREVIEW_EXPIRED'         : PreviewExpired,
  'ASSEMBLY_PART_NOT_FOUND' : AssemblyPartNotFound,
}

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const ModalRoot = (modal) => {
  if (!modal.modalType) {
    return null
  }
  const SpecificModal = modalComponents[modal.modalType];
  if(!SpecificModal){
    console.error(`${modal.modalType} Modal could not be found`);
    return null
  }
  const extendedModalProps = Object.assign({}, modal.modalProps, {
    modalHide: modal.modalHide,
    modalCancel: modal.modalCancel,
    modalConfirm: modal.modalConfirm
  });
  return (
    <SpecificModal {...extendedModalProps} />
  )
}

export const Component = React.createClass({
  render: function() {
    const { modal, dispatch } = this.props;

    // This transforms the modalCancel and modalConfirm actions and adds the modalHide action
    const modalExtended = Object.assign({}, modal, {
      modalHide: ()    => { this.props.ModalActions.hideModal({modalId: modal.modalId}) },
      // The cancel and confirm actions can be extended before dispatching
      modalCancel: (extendObject)  => callbackFunction(modal.modalCancel, dispatch, extendObject),
      modalConfirm: (extendObject) => callbackFunction(modal.modalConfirm, dispatch, extendObject),
    })

    return (
      <Modal
        isOpen={true}
        onRequestClose={()=>{
          modalExtended.modalCancel()
          modalExtended.modalHide()
        }}
        className={classes.modal}
        overlayClassName={classes.overlay+ ' layout-column layout-align-center-center'}>
        { ModalRoot(modalExtended) }
      </Modal>
    );
  }
});

function callbackFunction(callbackObject, dispatch, extendObject){
  // If it is a normal object, extend and dispatch it
  if(callbackObject && !callbackObject.aliased){
    dispatch(i.merge(callbackObject, extendObject))
  }
  else if(callbackObject && callbackObject.aliased){
    // Extend the aliased function inputs
    // We only extend if the object exists because sometimes the functionInputs
    // are an array and do not allow for extending.
    if(extendObject){
      dispatch(i.merge(callbackObject, {
        payload: {
          functionInputs: extendObject
        }
      }))
    }
    else{
      dispatch(callbackObject)
    }
  }
}

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    ModalActions: bindActionCreators(ModalActions, dispatch),
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
