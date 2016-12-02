// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Component Core
import React, {PropTypes} from 'react';

// Styles
import Modal from './Modal.jsx'

///////////////////////////////// COMPONENT /////////////////////////////////

const propTypesObject = {
  types : PropTypes.array,   // Array of modalTypes that can be displayed such as : ['FILE_DOWNLOAD']
                             // If not supplied, all modals will be dislayed
};

export const ModalContainer = React.createClass({
  propTypes: propTypesObject,
  render: function() {
    const { modals, types } = this.props;
    const stack         = modals.stack ? modals.stack : [];
    const filteredStack = types ? stack.filter(modal => types.includes(modal.modalType)) : stack;
    if(filteredStack.length > 0){
      return (
        <div>
          {filteredStack.map(modal => modal ? <Modal key={modal.modalId} modal={modal}></Modal> : '')}
        </div>
      );
    }
    else{
      return null
    }
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({modals}) {
  return {
    modals
  };
}

export default connect(mapStateToProps)(ModalContainer);
