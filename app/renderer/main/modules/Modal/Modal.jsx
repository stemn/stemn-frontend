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
import ErrorModal from './modals/ErrorModal.jsx';

const modalComponents = {
  'CONFIRM' : ConfirmModal,
  'ERROR'   : ErrorModal,
}

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////




const ModalRoot = (modal) => {
  if (!modal.modalType) {
    return null
  }
  const SpecificModal = modalComponents[modal.modalType];
  return (
    <SpecificModal modal={modal} />
  )
}

export const Component = React.createClass({
  modalHide: function() {

  },

  render: function() {
    const { modal, dispatch } = this.props;
    const modalExtended = Object.assign({}, modal, {
      modalHide: ()    => { this.props.ModalActions.hideModal({modalId: modal.modalId}) },
      modalCancel: ()  => { if(modal.modalCancel) { dispatch(modal.modalCancel) }},
      modalConfirm: () => { if(modal.modalConfirm){ dispatch(modal.modalConfirm) }},
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
