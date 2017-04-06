import React from 'react'
import ModalContainer from 'stemn-frontend-shared/misc/Modal/ModalContainer.jsx'
import ToastContainer from 'stemn-frontend-shared/misc/Toasts/Toasts.jsx'
//import Smooch from 'stemn-shared/misc/Smooch/Smooch.jsx'

export default (props) => {
  return (
    <div className='layout-column flex'>
      <div className='layout-column flex'>{props.children}</div>
      <ModalContainer />
      <ToastContainer />
    </div>
  )
}
