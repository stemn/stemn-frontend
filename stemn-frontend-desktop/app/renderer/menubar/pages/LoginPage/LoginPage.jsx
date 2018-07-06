import { connect } from 'react-redux'

// Component Core
import React from 'react'

// Actions
import * as ElectronWindowsActions from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'

// Sub Components
import Toolbar from 'stemn-frontend-desktop/app/renderer/menubar/modules/Toolbar/Toolbar.jsx'
import cloudProject   from 'stemn-shared/assets/images/pure-vectors/cloud-project.svg'
import Button  from 'stemn-shared/misc/Buttons/Button/Button.jsx'


// /////////////////////////////// COMPONENT /////////////////////////////////


// event.sender.send('tray-removed')
// trayIcon.destroy()

export class Component extends React.Component {
  render() {
    const {
      dispatch,
    } = this.props
    return (
      <div className="layout-column flex">
        <Toolbar />
        <div className="flex layout-column layout-align-center-center text-center" style={ { padding: '15px' } }>
          <img src={ cloudProject } style={ { width: '100px', height: '100px' } } />
          <div
            className="text-title-4"
            style={ { fontWeight: '500' } }
          >
            Connect to STEMN
          </div>
          <div
            style={ { margin: '15px 0' } }
            className="text-subtitle-1"
          >
            Access revision history, file previews<br />and STEMN collaboration tools.
          </div>
          <Button
            style={ { marginBottom: '40px' } }
            onClick={ () => dispatch(ElectronWindowsActions.show('main')) }
            className="primary"
          >
            Get started
          </Button>
        </div>
      </div>
    )
  }
}


// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(Component)
