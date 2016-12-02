import React, { PropTypes } from 'react';
import ModalContainer from 'app/renderer/main/modules/Modal/ModalContainer.jsx'

function App({ children }) {
  return (
    <div className="layout-column flex">
      {children}
      <ModalContainer types={['FILE_DOWNLOAD']} />
    </div>
  );
}

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
