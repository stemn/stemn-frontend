// Component Core
import React from 'react';
import http from 'axios';
import { version } from 'package-json'

// Styles
import classNames from 'classnames';

import Button from 'stemn-shared/misc/Buttons/Button/Button'
import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx';
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';

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
        releaseNotes: `${response.data.body}` ,
        loading: false
      })
    }).catch(response => {
      this.setState({
        releaseNotes: `Could not find any release notes for this version.` ,
        loading: false
      })
    })
  },
  render: function() {
    const { modalHide } = this.props;
    const { loading, releaseNotes} = this.state;

    return (
      <div style={{width: '600px'}}>
        <div className="modal-title">Version {version}</div>
        <div className="modal-body rel-box" style={{minHeight: '200px'}}>
          <LoadingOverlay show={loading}/>
          <EditorDisplay value={releaseNotes}/>
        </div>
        <div className="modal-footer-no-line layout-row layout-align-start-center">
          <a href="https://github.com/Stemn/Stemn-Desktop/releases" className="link-primary">View all release notes</a>
          <div className="flex"></div>
          <Button className="primary" onClick={() => {modalHide()}}>Close</Button>
        </div>
      </div>
    )
  }
});

export default Component
