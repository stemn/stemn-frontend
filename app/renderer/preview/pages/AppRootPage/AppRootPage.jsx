import React, { PropTypes } from 'react';
import ModalContainer from 'app/renderer/main/modules/Modal/ModalContainer.jsx'
import TitleBar from 'app/renderer/main/components/TitleBar/TitleBar';

function App({ children }) {
  return (
    <div className="layout-column flex">
      <TitleBar />
      {children}
      <ModalContainer types={['FILE_DOWNLOAD']} />
    </div>
  );
}

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
