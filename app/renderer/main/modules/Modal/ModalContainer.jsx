// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Component Core
import React, {PropTypes} from 'react';
import { omit } from 'lodash';

// Styles
import Modal from './Modal.jsx'

///////////////////////////////// COMPONENT /////////////////////////////////

const propTypesObject = {
  types : PropTypes.array,   // Array of modalTypes that can be displayed such as : ['FILE_DOWNLOAD'] (If not supplied, all modals will be dislayed)
  modals: PropTypes.array,    // Modals object
  children: PropTypes.node    // Child node
};

export const ModalContainer = React.createClass({
  propTypes: propTypesObject,
  render: function() {
    const { modals, types, children } = this.props;
    const stack         = modals.stack ? modals.stack : [];
    const filteredStack = types ? stack.filter(modal => types.includes(modal.modalType)) : stack;
    const modalIsOpen   = filteredStack.length > 0

    const getModals = () => {
      return modalIsOpen
      ? <div>
          {filteredStack.map(modal => modal ? <Modal key={modal.modalId} modal={modal}></Modal> : '')}
        </div>
      : null
    }

    const childStyles = modalIsOpen ? {
      filter: 'blur(2px)',
      transition: '0s ease all'
    } : {
      transition: '0s ease all'
    };

    return (
      <div { ...omit(this.props, Object.keys(propTypesObject))}>
        { children ? React.cloneElement(children, {style: childStyles}) : null}
        { getModals () }
      </div>
    )
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({modals}) {
  return {
    modals
  };
}

export default connect(mapStateToProps)(ModalContainer);
