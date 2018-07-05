import { connect } from 'react-redux'

// Component Core
import React from 'react'

import classes from '../ProjectPage/ProjectSettingsPage/ProjectSettingsPage.css'

// Sub Components
import Header from 'stemn-shared/misc/Header/Header.jsx'
import NavPill from 'stemn-shared/misc/Buttons/NavPill/NavPill'


// ///////////////////////////////////////////////////////////////////////////
// /////////////////////////////// COMPONENT /////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

export class Component extends React.Component {
  render() {
    const { auth } = this.props
    return (
      <div className="layout-column flex">
        <Header>
          <b>Settings</b>
        </Header>
        <div className={ `${classes.container} layout-row flex scroll-box` }>
          <div style={ { width: '250px', marginRight: '15px' } }>
            <div className={ classes.panel } style={ { padding: '0px' } }>
              <NavPill className="primary" href="https://stemn.com/settings">More settings: stemn.com</NavPill>
            </div>
            <div className={ classes.panel } style={ { padding: '0px' } }>
              <NavPill to="/settings/application">Application</NavPill>
              { auth.authToken
                ? <NavPill to="/settings/account">Account</NavPill>
                : <NavPill to="/login">Login</NavPill> }
            </div>
          </div>
          <div style={ { width: '650px' } }>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

// ///////////////////////////////////////////////////////////////////////////
// /////////////////////////////// CONTAINER /////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

function mapStateToProps({ auth }, { params }) {
  return {
    auth,
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
