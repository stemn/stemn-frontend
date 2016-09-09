// Component Core
import React from 'react';

import Button from 'app/renderer/main/components/Buttons/Button/Button'

// Styles
import classNames from 'classnames';

const Component = React.createClass({
  render: function() {
    const { modal } = this.props;
    return (
      <div>
        <div className="modal-title">Are you sure?</div>
        <div className="modal-body">Some modal body stuff</div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button style={{marginRight: '10px'}} onClick={() => {modal.modalCancel(); modal.modalHide()}}>Cancel</Button>
          <Button className="primary" onClick={() => {modal.modalConfirm(); modal.modalHide()}}>Confirm</Button>
        </div>
      </div>
    )
  }
});

export default Component
