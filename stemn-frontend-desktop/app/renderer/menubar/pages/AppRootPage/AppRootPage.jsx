import React from 'react'
import UpdateBanner from '../../../shared/updates/UpdateBanner.jsx'

function App({ children }) {
  return (
    <div className="layout-column flex">
      <UpdateBanner />
      {children}
    </div>
  )
}

export default App
