// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SystemActions from 'app/shared/actions/system';
import * as StateActions from 'app/shared/actions/state';
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from 'app/renderer/main/pages/ProjectPage/ProjectSettingsPage/ProjectSettingsPage.css'

// Sub Components
import { Field } from 'react-redux-form';
import { Link } from 'react-router';
import Toggle from 'app/renderer/main/components/Input/Toggle/Toggle'
import ProgressButton from 'app/renderer/main/components/Buttons/ProgressButton/ProgressButton.jsx'
import FileSelectInputElectron from 'app/renderer/main/modules/FileSelectInput/FileSelectInputElectron.jsx'

///////////////////////////////// COMPONENT /////////////////////////////////

const inputStyles = {
  textTransform: 'capitalize',
  padding: '0 10px',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.03)',
  borderRight: '1px solid rgb(234, 234, 234)',
  minWidth: '80px'
}

export const Component = React.createClass({
  confirmReset(){
    this.props.modalActions.showConfirm({
      message: 'This will clear all data and reset the application back to factory settings. This can be useful if some data has been corrupted.',
      modalConfirm: StateActions.clearState()
    })
  },
  render() {
    const { system } = this.props;
    return (
      <div>
        <div className={classes.panel}>
          <h3>Cloud Providers</h3>
          <p>Set the root folder for Dropbox and Drive.</p>
          <div style={{marginBottom: '10px'}}>
            <FileSelectInputElectron
              title="Select Root Dropbox Location"
              model="system.providerPath.dropbox"
              value={system.providerPath.dropbox}>
              <div className="layout-column layout-align-center-center" style={inputStyles}>Dropbox</div>
            </FileSelectInputElectron>
          </div>
          <div style={{marginBottom: '10px'}}>
            <FileSelectInputElectron
              title="Select Root Drive Location"
              model="system.providerPath.drive"
              value={system.providerPath.drive}>
              <div className="layout-column layout-align-center-center" style={inputStyles}>Drive</div>
            </FileSelectInputElectron>
          </div>

        </div>
        {system.currentVersion
        ? (
          <div className={classes.panel}>
            <h3>Application info</h3>
            <p>Stemn Desktop is currently in alpha. Please report any bugs and they will be fixed ASAP.</p>
            <p>Version: <b>{system.currentVersion}</b></p>
          </div>)
        : null}


        <div className={classes.panel}>
          <h3>Reset Application</h3>
          <p>Clear all cached data and reset the application back to factory settings.</p>
          <div className="layout-row layout-align-end">
            <ProgressButton className="warn" onClick={this.confirmReset}>
              Clear data
            </ProgressButton>
          </div>
        </div>
      </div>
    );
  }
});

//          <div className={classes.panel}>
//            <h3>Privacy</h3>
//            <p>Help us improve by sending anonymous usage data</p>
//          </div>
//            <Toggle model="settings.privacy" value={this.props.settings.privacy} />

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({users, system}, {params}) {
  return {
    system,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    systemActions: bindActionCreators(SystemActions, dispatch),
    stateActions: bindActionCreators(StateActions, dispatch),
    modalActions: bindActionCreators(ModalActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
