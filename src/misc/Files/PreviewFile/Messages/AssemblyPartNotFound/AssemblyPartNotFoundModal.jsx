import React from 'react';
import Button from 'stemn-frontend-shared/src/misc/Buttons/Button/Button'
import StandardTable from 'stemn-frontend-shared/src/misc/Tables/StandardTable/StandardTable.jsx'
import classNames from 'classnames';

const Component = React.createClass({
  render: function() {
    const { modalCancel, modalHide, modalConfirm } = this.props;
    const { parts } = this.props;
    return (
      <div style={{width: '500px'}}>
        <div className="modal-title">
          Assembly part could not be found
        </div>
        <div className="modal-body" style={{lineHeight: '1.4em'}}>
          <p>Assembly rendering is in Beta - we need your help to perfect it. Currently, we can only find sub-parts if they are in the same folder (or a sub-folder) of the main assembly file.</p>
          <p>If your assembly is not rendering, please add your voice to the <a className="link-primary" href="https://github.com/Stemn/Stemn-Desktop/issues/4">assembly part not found issue</a>.</p>
        </div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button
            className="primary"
            onClick={modalHide}>
            OK
          </Button>
        </div>
      </div>
    )
  }
});

export default Component
