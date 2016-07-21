import React, { PropTypes } from 'react';
import AutoUpdater from '../AutoUpdater';
import Header from '../Header';

function App({ children, system, settings, header }) {
  return (
    <div className="layout-row flex">
      <div className="layout-column">

      </div>
      <div className="layout-column flex">
        <Header header={header}/>
        <div className="layout-column flex">
          {children}
        </div>
      </div>
      {
        (() => {
          if (process.env.NODE_ENV !== 'production') {
//            const DevTools = require('../DevTools'); // eslint-disable-line global-require
//            return <DevTools />;
          }
          return null;
        })()
      }
    </div>

  );
}
//          <Sidebar/>
//         <AutoUpdater system={system} />

//          <TitleBar
//            title=" "
//            controls
//            isMaximized={!this.state.isMaximized}
//            theme={this.props.theme}
//            background={this.props.color}
//            onCloseClick={this.close}
//            onMinimizeClick={this.minimize}
//            onMaximizeClick={this.toggleMaximize}
//            onRestoreDownClick={this.toggleMaximize}
//          />

App.propTypes = {
  children: PropTypes.element.isRequired,
  system: PropTypes.object.isRequired,
};

export default App;
