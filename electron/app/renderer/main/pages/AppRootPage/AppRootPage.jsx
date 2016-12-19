import React from 'react';
import ModalContainer from 'app/renderer/main/modules/Modal/ModalContainer.jsx'
import ToastContainer from 'app/renderer/main/modules/Toasts/Toasts.jsx'
//import Smooch from 'app/shared/modules/Smooch/Smooch.jsx'

export default (props) => {
  return (
    <div className="layout-column flex">
      <div className="layout-column flex">{props.children}</div>
      <ModalContainer />
      <ToastContainer />
    </div>
  )
}
