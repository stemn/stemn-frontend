// Component Core
import React from 'react';
import releaseNotes from 'raw!app/release-notes.md';

// Styles
import classNames from 'classnames';

import Button from 'app/renderer/main/components/Buttons/Button/Button'
import EditorDisplay from 'app/renderer/main/modules/Editor/EditorDisplay.jsx';

const Component = React.createClass({
  render: function() {
    const { modalHide } = this.props;
    return (
      <div style={{width: '700px'}}>
        <div className="modal-title">Stemn Release Notes</div>
        <div className="modal-body">
          <EditorDisplay value={releaseNotes}/>
        </div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button className="primary" onClick={() => {modalHide()}}>Close</Button>
        </div>
      </div>
    )
  }
});

export default Component
