import React, { Component, PropTypes } from 'react';

// Components
import WindowsTitleBar from 'app/renderer/main/components/TitleBar/TitleBar';

export default class App extends Component {
  render() {
    return (
      <div className="layout-column flex">
        <WindowsTitleBar theme="dark"/>
        {this.props.children}
      </div>
    );
  }
}
