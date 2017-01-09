import React from 'react';

import modelLocked    from 'electron/app/renderer/assets/images/pure-vectors/model-locked.svg';
import { connect } from 'react-redux';
import * as ModalActions from 'stemn-frontend-shared/src/misc/Modal/Modal.actions.js';

export const AssemblyPartNotFound = React.createClass({
  render() {
    const { dispatch, parts } = this.props;

    const openModal = () => {
      dispatch(ModalActions.showModal({modalType: 'ASSEMBLY_PART_NOT_FOUND', modalProps: {parts: parts}}))
    }
    return (
      <div className="layout-column layout-align-center-center flex text-center">
        <div style={{maxWidth: '300px'}}>
          <img style={{width: '100px'}} src={modelLocked}/>
          <div className="text-title-4" style={{marginBottom: '10px'}}>Assembly part could not be found!</div>
          <div className="text-title-5">Assembly rendering is Beta.<br/><a className="link-primary" onClick={openModal}>Help us fix it.</a></div>
        </div>
      </div>
    )
  }
});

export default connect()(AssemblyPartNotFound);
