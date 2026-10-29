import React from 'react'
import ModalContainer from 'stemn-shared/misc/Modal/ModalContainer.jsx'
import TitleBar from 'stemn-shared/misc/TitleBar/TitleBar'

function App({ children }) {
  return (
    <div className="layout-column flex">
      <TitleBar />
      {children}
      <ModalContainer types={['FILE_DOWNLOAD']} />
    </div>
  )
}

export default App
