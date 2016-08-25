import React from 'react';

import Tabs from 'app/renderer/main/components/Tabs/Tabs'
import Toggle from 'app/renderer/main/components/Input/Toggle/Toggle'
import SelectList from 'app/renderer/main/components/Input/SelectList/SelectList'
import Header from 'app/renderer/main/modules/Header/Header.jsx'

// Styles
import tabsStyles from 'app/renderer/main/components/Tabs/Tabs.css'



export default class SettingsPage extends React.Component{
  render(){
    return (
      <div className="layout-column flex">
        <Header>Account Settings</Header>
        <div className="layout-column flex rel-box" style={{padding: '5px 25px'}}>
          <Tabs>
            <a className="active">Application Settings</a>
            <a>Account Settings</a>
          </Tabs>
          <div className="layout-row flex">
            <div className="flex-50">
              <br/>
              <h3>Appearance</h3>
              <SelectList value="dark">
                <div value="light">Light</div>
                <div value="dark">Dark</div>
              </SelectList>
              <h3>Privacy</h3>
              <div>Help us improve by sending anonymous usage data</div>
              <Toggle model="settings.privacy" value={this.props.settings.privacy} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
