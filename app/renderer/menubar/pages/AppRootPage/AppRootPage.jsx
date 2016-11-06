import React, { PropTypes } from 'react';

function App({ children }) {
  return (
    <div className="layout-column flex">
      {children}
    </div>
  );
}

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
