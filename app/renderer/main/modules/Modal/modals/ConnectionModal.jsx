// Component Core
import React from 'react';

import Button from 'app/renderer/main/components/Buttons/Button/Button'

import RadioLocator   from 'app/renderer/assets/images/space-vectors/radio-locator.svg';

// Styles
import classNames from 'classnames';

const Component = React.createClass({
  render: function() {
    const { title, message, modalCancel, modalHide, modalConfirm } = this.props;
    return (
      <div style={{width: '600px', background: 'rgba(0, 0, 0, 0.05)', padding: '30px'}}>
        <div className="modal-body" style={{lineHeight: '1.4em'}}>
          <div className="text-center text-title-3">Connection Error</div>
          <div className="layout-row layout-align-center">
            <img style={{width: '300px', height: '300px'}} src={RadioLocator} />
          </div>
          <div className="text-center text-title-5">Could not connect to the remote server. Either the server or your internet is down.</div>
        </div>
      </div>
    )
  }
});

export default Component
