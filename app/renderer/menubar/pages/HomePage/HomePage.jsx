import React from 'react';

// Components
import { GoRepo }      from 'react-icons/lib/go';
import { MdOpenInNew } from 'react-icons/lib/md';
import Toolbar         from 'app/renderer/menubar/modules/Toolbar/Toolbar.jsx'
import * as ElectronWindowActions from 'app/shared/electronActions/window.js';

export default class extends React.Component{
  render() {
    return (
      <div className="flex layout-column">
        <Toolbar menu={true}>
          <div className="flex"></div>
          <MdOpenInNew onClick={()=>ElectronWindowActions.windowMainOpen()} size="22"/>
        </Toolbar>
        <div className="flex layout-column layout-align-center-center">
          <GoRepo size="50" />
          <div className="text-title-4" style={{marginTop: '20px'}}>No Project Selected</div>
        </div>
      </div>
    );
  }
};
