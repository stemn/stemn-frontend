// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ModalActions from './Modal.actions.js';

// Component Core
import React from 'react';
import Modal from 'react-modal';

// Styles
import classNames from 'classnames';
import classes from './Modal.css'

// Modals
import ConfirmModal from './modals/ConfirmModal.jsx';
import ErrorModal   from './modals/ErrorModal.jsx';
import FileSelectModal from 'app/renderer/main/modules/FileSelect/FileSelectModal.jsx'

const modalComponents = {
  'CONFIRM'     : ConfirmModal,
  'ERROR'       : ErrorModal,
  'FILE_SELECT' : FileSelectModal,
}

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


const ModalRoot = (modal) => {
  if (!modal.modalType) {
    return null
  }
  const SpecificModal = modalComponents[modal.modalType];
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
  modalHide: function() {

  },

  render: function() {
    const { modal, dispatch } = this.props;

    // This transforms the modalCancel and modalConfirm actions and adds the modalHide action
    const modalExtended = Object.assign({}, modal, {
      modalHide: ()    => { this.props.ModalActions.hideModal({modalId: modal.modalId}) },
      // The cancel and confirm actions can be extended before dispatching
      modalCancel: (extendObject)  => { if(modal.modalCancel) { dispatch(Object.assign({}, modal.modalCancel, extendObject)) }},
      modalConfirm: (extendObject) => { if(modal.modalConfirm){ dispatch(Object.assign({}, modal.modalConfirm, extendObject)) }},
    })

    const customStyles = {
      content : {
        width : modalExtended.modalOptions && modalExtended.modalOptions.width ? modalExtended.modalOptions.width : '600px',
      }
    };

    return (
      <Modal
        isOpen={true}
        onRequestClose={()=>{
          modalExtended.modalCancel()
          modalExtended.modalHide()
        }}
        style={customStyles}
        className={classes.modal}
        overlayClassName={classes.overlay+ ' layout-column layout-align-center-center'}>
        { ModalRoot(modalExtended) }
      </Modal>
    );
  }
});



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
