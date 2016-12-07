// Component Core
import React from 'react';
import http from 'axios';
import { version } from 'app/package.json'

// Styles
import classNames from 'classnames';

import Button from 'app/renderer/main/components/Buttons/Button/Button'
import EditorDisplay from 'app/renderer/main/modules/Editor/EditorDisplay.jsx';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';

const Component = React.createClass({
  getInitialState () {
    return {
      releaseNotes: '',
      loading: true
    }
  },
  componentWillMount() {
    http({
      url: `https://api.github.com/repos/stemn/stemn-desktop/releases/tags/v${version}`,
      headers: {
        Authorization: null
      }
    }).then(response => {
      this.setState({
        releaseNotes: `## Version ${version} \r\n ${response.data.body}\r\n\r\n [View All Release Notes](https://github.com/Stemn/Stemn-Desktop/releases)` ,
        loading: false
      })
    }).then(response => {
      this.setState({ loading: false })
    })
  },
  render: function() {
    const { modalHide } = this.props;
    const { loading, releaseNotes} = this.state;

    return (
      <div style={{width: '600px'}}>
        <div className="modal-title">Stemn Release Notes</div>
        <div className="modal-body rel-box" style={{minHeight: '200px', paddingTop: '0px'}}>
          <LoadingOverlay show={loading}/>
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
