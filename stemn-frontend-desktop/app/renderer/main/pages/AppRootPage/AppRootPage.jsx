import React from 'react'
import ModalContainer from 'stemn-shared/misc/Modal/ModalContainer.jsx'
import ToastContainer from 'stemn-shared/misc/Toasts/Toasts.jsx'
import UpdatePrompt from '../../../shared/updates/UpdatePrompt.jsx'
import UpdateTitleBarButton from '../../../shared/updates/UpdateTitleBarButton.jsx'
// import Smooch from 'stemn-shared/misc/Smooch/Smooch.jsx'

const AppRootPage = (props) => (
  <div className="layout-column flex">
    <div className="layout-column flex">{props.children}</div>
    <UpdateTitleBarButton />
    <ModalContainer />
    <ToastContainer />
    <UpdatePrompt />
  </div>
)

export default AppRootPage
