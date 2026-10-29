import { connect } from 'react-redux'
import React from 'react'
import Modal from './Modal.jsx'

export class ModalContainer extends React.Component {
  render() {
    const { modals, types, dispatch, ...otherProps } = this.props
    const stack = modals.stack ? modals.stack : []
    const filteredStack = types ? stack.filter((modal) => types.includes(modal.modalType)) : stack
    const modalIsOpen = filteredStack.length > 0

    const getModals = () =>
      modalIsOpen ? (
        <div>{filteredStack.map((modal) => (modal ? <Modal key={modal.modalId} modal={modal} /> : ''))}</div>
      ) : null

    return <div {...otherProps}>{getModals()}</div>
  }
}

function mapStateToProps({ modals }) {
  return {
    modals,
  }
}

export default connect(mapStateToProps)(ModalContainer)
