import React from 'react';

import expired from 'electron/app/renderer/assets/images/pure-vectors/expired.svg';
import { connect } from 'react-redux';
import * as ModalActions from 'stemn-frontend-shared/src/misc/Modal/Modal.actions.js';

export const PreviewExpired = React.createClass({
  render() {
    const { provider, dispatch } = this.props;

    const openModal = () => {
      dispatch(ModalActions.showModal({modalType: 'PREVIEW_EXPIRED', modalProps: {provider: provider}}))
    }
    return (
      <div className="layout-column layout-align-center-center flex text-center">
        <div style={{maxWidth: '300px'}}>
          <img style={{width: '100px'}} src={expired}/>
          <div className="text-title-4" style={{marginBottom: '10px'}}>This revision has expired</div>
          <div className="text-title-5">We could not find this revision in your <span style={{textTransform: 'capitalize'}}>{provider || 'provider'}</span>.<br/> <a className="link-primary" onClick={openModal}>Learn more.</a></div>
        </div>
      </div>
    )
  }
});

export default connect()(PreviewExpired);
