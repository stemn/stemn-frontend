import React, { PropTypes } from 'react';

const rootStyles = {
  height: '100vh',
  width: '100vw',
//  border: '1px solid rgb(183, 183, 183)'
}
function App({ children }) {
  return (
    <div className="layout-column" style={rootStyles}>
      {children}
    </div>
  );
}

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
