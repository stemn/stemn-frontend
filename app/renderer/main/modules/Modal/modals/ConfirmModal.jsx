// Component Core
import React from 'react';

import Button from 'app/renderer/main/components/Buttons/Button/Button'

// Styles
import classNames from 'classnames';

const Component = React.createClass({
  render: function() {
    const { title, message, modalCancel, modalHide, modalConfirm } = this.props;
    return (
      <div style={{width: '400px'}}>
        <div className="modal-title">{title || 'Are you sure you want to do this?'}</div>
        <div className="modal-body" style={{lineHeight: '1.4em'}}>{message || 'There will be no turning back.'}</div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button style={{marginRight: '10px'}} onClick={() => {modalCancel(); modalHide()}}>Cancel</Button>
          <Button className="warn" onClick={() => {modalConfirm(); modalHide()}}>Confirm</Button>
        </div>
      </div>
    )
  }
});

export default Component
