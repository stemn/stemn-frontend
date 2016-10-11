// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Component Core
import React from 'react';

// Styles
import Modal from './Modal.jsx'

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render: function() {
    const { modals } = this.props;
    if(modals.stack && modals.stack.length > 0){
      return (
        <div>
          {modals.stack.map(modal => modal ? <Modal key={modal.modalId} modal={modal}></Modal> : '')}
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

export default connect(mapStateToProps)(Component);
