import React from 'react';
import ModalContainer from 'stemn-shared/misc/Modal/ModalContainer.jsx';
import ToastContainer from 'stemn-shared/misc/Toasts/Toasts.jsx';

export default (props) => {
  return (
    <div className="layout-column flex" style={{minHeight: '100vh'}}>
      <div className="layout-column flex">{props.children}</div>
      <ToastContainer />
      <ModalContainer />

    </div>
  )
}
