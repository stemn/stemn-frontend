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


// Sub Components
import {MdMenu} from 'react-icons/lib/md';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const customStyles = {
  overlay : {
    backgroundColor : 'rgba(255, 255, 255, 0.8)',
    zIndex          : 10
  },
  content : {
    width : '600px',
  }
};


const Parent = React.createClass({
  doSomething: function(value) {
    console.log('doSomething called by child with value:', value);
  },

  render: function() {


    return <div>{childrenWithProps}</div>
  }
});


export const Component = React.createClass({
  getInitialState: function() {
    return { modalIsOpen: false };
  },

  openModal: function() {
    this.props.ModalActions.showModal({modalId: this.props.modalId})
  },

  afterOpenModal: function() {

  },

  closeModal: function() {
    this.props.ModalActions.hideModal({modalId: this.props.modalId})
  },

  render: function() {
    const isOpen = this.props.modal ? this.props.modal.isOpen : false;

    // Wrap the child elements with the open and close functions
    const childrenWithProps = React.Children.map(this.props.children,
     (child) => React.cloneElement(child, {
       openModal: this.openModal,
       closeModal: this.closeModal
     })
    );

    return (
      <div>
        <div onClick={this.openModal}>
          {childrenWithProps[0]}
        </div>
        <Modal
          isOpen={isOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          className={classes.modal}>
          {childrenWithProps[1]}
        </Modal>
      </div>
    );
  }
});



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({modals}, {modalId}) {
  return {
    modal: modals[modalId]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ModalActions: bindActionCreators(ModalActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
