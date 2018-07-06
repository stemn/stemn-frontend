import { connect } from 'react-redux'

import { hideModal, resolveModal, rejectModal } from './Modal.actions.js'

import React, { Component } from 'react'
import Modal from 'react-modal'

import classes from './Modal.css'

import { getModal } from './ModalRegistry'


// /////////////////////////////// COMPONENT /////////////////////////////////

class ModalComponent extends Component {
  renderContent() {
    // Get the modal from the modal registry and add the modal props.
    const { modal } = this.props

    let template = null
    if (modal.modalType) {
      const ModalTemplate = getModal(modal.modalType)
      if (ModalTemplate) {
        const additionalProps = {
          modalCancel: this.modalCancel,
          modalConfirm: this.modalConfirm,
        }
        const allProps = Object.assign({}, modal.modalProps, additionalProps)
        template = <ModalTemplate { ...allProps } />
      }
    }

    return template
  }

  modalCancel = (data = {}) => {
    const { modalId } = this.props.modal
    // If the data is an object, string, number or boolean. Resolve
    // This is used to ignore mouse click events
    if (['Object', 'String', 'Number', 'Boolean'].includes(data.constructor.name)) {
      this.props.rejectModal({ modalId, data })
    } else {
      this.props.rejectModal({ modalId })
    }
    this.props.hideModal({ modalId })
  }
  modalConfirm = (data = {}) => {
    const { modalId } = this.props.modal
    // If the data is an object, string, number or boolean. Resolve
    // This is used to ignore mouse click events
    if (['Object', 'String', 'Number', 'Boolean'].includes(data.constructor.name)) {
      this.props.resolveModal({ modalId, data })
    } else {
      this.props.resolveModal({ modalId })
    }
    this.props.hideModal({ modalId })
  }
  onRequestClose = () => {
    const { modal } = this.props
    if (modal.modalOptions && modal.modalOptions.noClickClose) {
      
    } else {
      this.modalCancel()
    }
  }
  render() {
    const { modal } = this.props
    const overlayClassName = `${classes.overlay} layout-column layout-align-center-center`

    return (
      <Modal
        isOpen
        onRequestClose={ this.onRequestClose }
        className={ classes.modal }
        overlayClassName={ overlayClassName }
        contentLabel={ modal.modalType }
      >
        { this.renderContent() }
      </Modal>
    )
  }
}


// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps() {
  return {}
}

const mapDispatchToProps = {
  hideModal,
  resolveModal,
  rejectModal,
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponent)
