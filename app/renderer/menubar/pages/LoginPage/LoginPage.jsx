// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
//import * as ElectronWindowActions from 'app/shared/electronActions/window.js';
import * as ElectronWindowsActions from 'app/shared/modules/ElectronWindows/ElectronWindows.actions.js';
import { push } from 'react-router-redux';
// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import Toolbar from 'app/renderer/menubar/modules/Toolbar/Toolbar.jsx'
import cloudProject   from 'app/renderer/assets/images/pure-vectors/cloud-project.svg';
import Button  from 'app/renderer/main/components/Buttons/Button/Button.jsx';

import PopoverMenu          from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import PopoverMenuList      from 'app/renderer/main/components/PopoverMenu/PopoverMenuList';
import SimpleIconButton     from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
import MdMoreHoriz          from 'react-icons/md/more-horiz';

///////////////////////////////// COMPONENT /////////////////////////////////


// event.sender.send('tray-removed')
// trayIcon.destroy()
        
export const Component = React.createClass({
  render() {
    const { AuthActions, auth, dispatch } = this.props;
    console.log(auth);
    const menu = [{
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

    return (
      <div className="layout-column flex">
        <Toolbar>
         <div className="flex"></div>
          <PopoverMenu preferPlace="below">
            <SimpleIconButton title="Options">
              <MdMoreHoriz size="20px" />
            </SimpleIconButton>
            <PopoverMenuList menu={menu} />
          </PopoverMenu>
          
        </Toolbar>
        <div className="flex layout-column layout-align-center-center text-center" style={{padding: '15px'}}>
          <img src={cloudProject} style={{width: '100px', height: '100px'}}/>
          <div className="text-title-4"
          style={{fontWeight: '500'}}>
            Connect to STEMN
          </div>
          <div style={{margin: '15px 0'}}
          className="text-subtitle-1">
            Access revision history, file previews<br/>and STEMN collaboration tools.
          </div>
          <Button style={{marginBottom: '40px'}}
          onClick={() => dispatch(ElectronWindowsActions.show('main'))}
          className="primary">
            Get started
          </Button>
        </div>
      </div>
    );
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Component);
