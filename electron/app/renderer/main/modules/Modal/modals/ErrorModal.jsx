// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import Button from 'electron/app/renderer/main/components/Buttons/Button/Button'

const Component = React.createClass({
  render() {
    const { title, body, modalCancel, modalHide, modalConfirm } = this.props;

    return (
      <div style={{width: '500px'}}>
        <div className="modal-title">{title}</div>
        <div className="modal-body" style={{lineHeight: '1.4em'}} dangerouslySetInnerHTML={{ __html: body }}></div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button className="warn" onClick={() => {modalConfirm(); modalHide()}}>Ok</Button>
        </div>
      </div>
    )
  }
});

export default Component
