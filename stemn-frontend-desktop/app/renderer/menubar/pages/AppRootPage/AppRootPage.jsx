import React from 'react'
import PropTypes from 'prop-types'

function App({ children }) {
  return (
    <div className="layout-column flex">
      {children}
    </div>
  )
}

App.propTypes = {
  children: PropTypes.node,
}

export default App
