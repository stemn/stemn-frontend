import React, { PropTypes } from 'react';
import TitleBar from 'app/renderer/main/components/TitleBar/TitleBar';


function App({ children }) {
  return (
    <div className="layout-column flex">
      {children}
    </div>
  );
}

//    <div className="layout-column flex">
//      <TitleBar />
//    </div>

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
