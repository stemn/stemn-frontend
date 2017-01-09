import React from 'react';
import ModalContainer from 'stemn-frontend-shared/src/misc/Modal/ModalContainer.jsx'
import ToastContainer from 'stemn-frontend-shared/src/misc/Toasts/Toasts.jsx'
//import Smooch from 'stemn-frontend-shared/src/misc/Smooch/Smooch.jsx'

export default (props) => {
  return (
    <div className="layout-column flex">
      <div className="layout-column flex">{props.children}</div>
      <ModalContainer />
      <ToastContainer />
    </div>
  )
}
