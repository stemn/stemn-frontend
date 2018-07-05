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
  children: PropTypes.element.isRequired,
}

export default App
