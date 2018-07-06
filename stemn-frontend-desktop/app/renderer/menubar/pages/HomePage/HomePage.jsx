import React from 'react'

// Components
import book   from 'stemn-shared/assets/images/pure-vectors/book.svg'
import Toolbar         from 'stemn-frontend-desktop/app/renderer/menubar/modules/Toolbar/Toolbar.jsx'

export default class HomePage extends React.Component {
  render() {
    return (
      <div className="flex layout-column">
        <Toolbar menu>
          <div className="flex" />
        </Toolbar>
        <div className="flex layout-column layout-align-center-center">
          <img src={ book } style={ { width: '100px', height: '100px' } } />
          <div className="text-title-5" style={ { marginTop: '20px' } }>No Project Selected</div>
        </div>
      </div>
    )
  }
}
