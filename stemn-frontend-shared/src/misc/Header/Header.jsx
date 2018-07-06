import { connect } from 'react-redux'

// Container Actions
import { toggleSidebar } from 'stemn-shared/misc/Sidebar/Sidebar.actions.js'

// Component Core
import React from 'react'

import classes from './Header.css'

// Sub Components
import MdMenu from 'react-icons/md/menu'

// /////////////////////////////// COMPONENT /////////////////////////////////

export class Component extends React.Component {
  render() {
    const { dispatch, children, sidebar } = this.props
    const styles = this.props.absolute ? { position: 'absolute' } : this.props.style
    return (
      <div className={ `${classes.toolbar} layout-row layout-align-start-center rel-box` } style={ styles }>
        <div className={ classes.dragger } />
        <div className={ `${classes.inner} layout-row layout-align-start-center flex` }>
          {!sidebar.show ? <a onClick={ () => dispatch(toggleSidebar()) } style={ { marginRight: '15px' } }><MdMenu size="25" /></a> : ''}
          {children}
        </div>
      </div>
    )
  }
}

// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ header, auth, sidebar }, { location }) {
  return {
    header,
    auth,
    sidebar,
    location,
  }
}


export default connect(mapStateToProps)(Component)
