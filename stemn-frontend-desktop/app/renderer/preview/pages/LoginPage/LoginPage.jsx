import { connect } from 'react-redux'

// Component Core
import React from 'react'

// Actions
import * as ElectronWindowsActions from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'

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
      <div className="flex layout-column layout-align-center-center text-center">
        <div style={ { maxWidth: '300px' } }>
          <img src={ cloudProject } style={ { width: '100px', height: '100px' } } />
          <div className="text-title-4" style={ { marginBottom: '10px' } }>Connect to Stemn</div>
          <div className="text-title-5" style={ { marginBottom: '20px' } }>You must be logged in to Stemn Desktop before you can preview files.</div>
          <Button onClick={ () => dispatch(ElectronWindowsActions.show('main')) } className="primary">Get started</Button>
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
