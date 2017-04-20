import { connect } from 'react-redux'
import React, { PropTypes } from 'react'
import Modal from './Modal.jsx'

const propTypesObject = {
  types : PropTypes.array,     // Array of modalTypes that can be displayed such as : ['FILE_DOWNLOAD'] (If not supplied, all modals will be dislayed)
  modals: PropTypes.object,    // Modals object
}

export const ModalContainer = React.createClass({
  propTypes: propTypesObject,
  render() {
    const { modals, types, dispatch, ...otherProps } = this.props;
    const stack = modals.stack
      ? modals.stack
      : []
    const filteredStack = types
      ? stack.filter(modal => types.includes(modal.modalType))
      : stack
    const modalIsOpen = filteredStack.length > 0

    const getModals = () => {
      return modalIsOpen
      ? <div>
          { filteredStack.map(modal => modal
            ? <Modal key={modal.modalId} modal={modal}></Modal>
            : '') }
        </div>
      : null
    }

    return (
      <div { ...otherProps }>
        { getModals () }
      </div>
    )
  }
})

function mapStateToProps({modals}) {
  return {
    modals,
  }
}

export default connect(mapStateToProps)(ModalContainer)
