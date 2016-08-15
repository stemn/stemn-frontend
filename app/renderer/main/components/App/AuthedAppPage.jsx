import React, { Component, PropTypes } from 'react';

// Components
import WindowsTitleBar       from 'app/renderer/main/components/TitleBar/TitleBar';
import Sidebar        from '../../containers/Sidebar';
import Header         from '../../containers/Header';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  };
  render() {
    return (
      <div className="layout-row flex">
        <div className="layout-column">
          <Sidebar params={this.props.params}/>
        </div>
        <div className="layout-column flex rel-box">
          <WindowsTitleBar theme="dark"/>
          <div className="layout-column flex">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
