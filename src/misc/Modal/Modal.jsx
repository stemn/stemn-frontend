import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import i from 'icepick';

import { hideModal } from './Modal.actions.js';

import React, { Component } from 'react';
import Modal from 'react-modal';

import classes from './Modal.css'

import { getModal } from './ModalRegistry';


///////////////////////////////// COMPONENT /////////////////////////////////

class ModalComponent extends Component {
  renderContent() {
    // Get the modal from the modal registry and add the modal props.
    const { modal } = this.props;

    let template = null
    if (modal.modalType) {
      const ModalTemplate = getModal(modal.modalType);
      if (ModalTemplate) {
        const additionalProps = {
          modalHide: this.modalHide,
          modalCancel: this.modalCancel,
          modalConfirm: this.modalConfirm
        }
        const allProps = Object.assign({}, modal.modalProps, additionalProps)
        template = <ModalTemplate { ...allProps } />
      }
    }

    return template
  }

  callbackFunction = (callbackObject, extendObject) => {
    const { dispatch } = this.props;
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

  modalHide = () => {
    const { modalId } = this.props.modal;
    this.props.hideModal({ modalId })
  }
  modalCancel = (extendObject) => this.callbackFunction(this.props.modal.modalCancel, extendObject)
  modalConfirm = (extendObject) => this.callbackFunction(this.props.modal.modalConfirm, extendObject)
  onRequestClose = () => {
    const { modal } = this.props;
    if (modal.modalOptions && modal.modalOptions.noClickClose) {
      return
    } else {
      this.modalCancel()
      this.modalHide()
    }
  }
  render() {
    const { modal, dispatch } = this.props;
    const overlayClassName = classes.overlay+ ' layout-column layout-align-center-center';

    return (
      <Modal
        isOpen
        onRequestClose={ this.onRequestClose }
        className={ classes.modal }
        overlayClassName={ overlayClassName }>
        { this.renderContent() }
      </Modal>
    );
  }
};



///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    hideModal: bindActionCreators(hideModal, dispatch),
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponent);
