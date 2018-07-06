import { connect } from 'react-redux'

// Container Actions
import * as ElectronWindowsActions from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import { push } from 'react-router-redux'
import { toggleMenubarSidebar } from 'stemn-shared/misc/Sidebar/Sidebar.actions.js'

// Component Core
import React from 'react'

// Styles
import cn from 'classnames'
import toolbarStyles from './Toolbar.css'

// Sub Components
import Popover from 'stemn-shared/misc/Popover'
import PopoverMenuList      from 'stemn-shared/misc/PopoverMenu/PopoverMenuList'
import SimpleIconButton     from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdMenu               from 'react-icons/md/menu'
import MdMoreHoriz          from 'react-icons/md/more-horiz'
import MdOpenInNew          from 'react-icons/md/open-in-new'

// /////////////////////////////// COMPONENT /////////////////////////////////

export class Component extends React.Component {
  render() {
    const { menu, children, dispatch } = this.props


    const menuItems = [{
      label: 'Open main window',
      onClick: () => dispatch(ElectronWindowsActions.show('main')),
    }, {
      label: 'Preferences',
      onClick: () => dispatch(push({
        pathname: '/settings/application',
        state: { meta: { scope: ['main'] } },
      })),
    }, {
      label: 'Account Settings',
      onClick: () => dispatch(push({
        pathname: '/settings/account',
        state: { meta: { scope: ['main'] } },
      })),
    }, {
      label: 'Quit Stemn',
      divider: true,
      onClick: () => dispatch(ElectronWindowsActions.quit()),
    }]

    const textStyle = menu ? { marginLeft: '5px' } : {}
    return (
      <div className={ cn(toolbarStyles.toolbar, 'layout-row layout-align-start-center') }>
        { menu
          ? <SimpleIconButton
            color="white"
            title="Projects Menu"
            onClick={ () => dispatch(toggleMenubarSidebar(true)) }
          >
            <MdMenu size="22" />
          </SimpleIconButton>
          : '' }
        <div className="flex layout-row layout-align-start-center" style={ textStyle }>
          {children}
        </div>
        <SimpleIconButton
          color="white"
          onClick={ () => dispatch(ElectronWindowsActions.show('main')) }
          title="Open main window"
        >
          <MdOpenInNew size="20px" />
        </SimpleIconButton>
        <Popover preferPlace="below">
          <SimpleIconButton
            title="Options"
            color="white"
          >
            <MdMoreHoriz size="20px" />
          </SimpleIconButton>
          <PopoverMenuList menu={ menuItems } />
        </Popover>
      </div>
    )
  }
}

// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
