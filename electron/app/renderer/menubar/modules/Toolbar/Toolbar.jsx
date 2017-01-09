// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as MenubarLayoutActions from 'stemn-frontend-shared/src/redux/actions/menubarLayout';
import * as ElectronWindowsActions from 'stemn-frontend-shared/src/desktop/ElectronWindows/ElectronWindows.actions.js';
import { push } from 'react-router-redux';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import toolbarStyles from './Toolbar.css'

// Sub Components
import PopoverMenu          from 'stemn-frontend-shared/src/misc/PopoverMenu/PopoverMenu';
import PopoverMenuList      from 'stemn-frontend-shared/src/misc/PopoverMenu/PopoverMenuList';
import SimpleIconButton     from 'stemn-frontend-shared/src/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdMenu               from 'react-icons/md/menu';
import MdMoreHoriz          from 'react-icons/md/more-horiz';
import MdOpenInNew          from 'react-icons/md/open-in-new';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  render() {
    const { menu, menubarLayoutActions, children, dispatch } = this.props;


    const menuItems = [{
      label: 'Open main window',
      onClick: () => dispatch(ElectronWindowsActions.show('main'))
    },{
      label: 'Preferences',
      onClick: () => dispatch(push({
        pathname: '/settings/application',
        state: {meta : {scope: ['main']}}
      }))
    },{
      label: 'Account Settings',
      onClick: () => dispatch(push({
        pathname: '/settings/account',
        state: {meta : {scope: ['main']}}
      }))
    },{
      label: 'Quit Stemn',
      divider: true,
      onClick: () => dispatch(ElectronWindowsActions.quit())
    }]

    const textStyle = menu ? {marginLeft: '5px'} : {};
    return (
      <div className={classNames(toolbarStyles.toolbar, 'layout-row layout-align-start-center')}>
        { menu
        ? <SimpleIconButton
            color="white"
            title="Projects Menu"
            onClick={()=>menubarLayoutActions.toggleSidebar(true)}>
            <MdMenu size="22"/>
          </SimpleIconButton>
        : '' }
        <div className="flex layout-row layout-align-start-center" style={textStyle}>
          {children}
        </div>
        <SimpleIconButton
          color="white"
          onClick={()=>dispatch(ElectronWindowsActions.show('main'))}
          title="Open main window">
          <MdOpenInNew size="20px"/>
        </SimpleIconButton>
        <PopoverMenu preferPlace="below">
          <SimpleIconButton title="Options"
            color="white">
            <MdMoreHoriz size="20px" />
          </SimpleIconButton>
          <PopoverMenuList menu={menuItems} />
        </PopoverMenu>
      </div>
    );
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    menubarLayoutActions: bindActionCreators(MenubarLayoutActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
