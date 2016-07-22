import React, { Component, PropTypes } from 'react';
import electron from 'electron';

// Components
import { TitleBar }   from 'react-desktop/windows';
import Sidebar        from '../../containers/Sidebar';
import Header         from '../../containers/Header';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  static defaultProps = {
    color: 'white',
    theme: 'light'
  };

  constructor(props) {
    super(props);
    this.state = { isMaximized: true };
  }

  close = () => {
    var window = electron.remote.getCurrentWindow();
    window.close();
  }
  minimize = () => {
    var window = electron.remote.getCurrentWindow();
    window.minimize();
  }

  toggleMaximize = () => {
    var window = electron.remote.getCurrentWindow();
    this.setState({ isMaximized: !this.state.isMaximized });
    if (!window.isMaximized()) {
      window.maximize();
    } else {
      window.unmaximize();
    }
  }


  render() {
    return (
      <div className="layout-row flex">
        <div className="layout-column">
          <Sidebar />
        </div>
        <div className="layout-column flex">
          <TitleBar
            title=" "
            controls
            isMaximized={!this.state.isMaximized}
            theme={this.props.theme}
            background={this.props.color}
            onCloseClick={this.close}
            onMinimizeClick={this.minimize}
            onMaximizeClick={this.toggleMaximize}
            onRestoreDownClick={this.toggleMaximize}
          />
          <Header />
          <div className="layout-column flex">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
