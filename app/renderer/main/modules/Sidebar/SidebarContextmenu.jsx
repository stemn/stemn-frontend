import React from 'react';
import { ContextMenu, MenuItem, SubMenu, connect as contextConnect} from "react-contextmenu";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SystemActions from 'app/shared/actions/system';

import { shell } from 'electron';
import os from 'os';

const Menu = React.createClass({
    displayName: "Menu",
    viewOnline(e, data) {
      shell.openExternal(`https://stemn.com/projects/${data.stub}`);
    },
    viewGeneralSettingsOnline(e, data) {
      shell.openExternal(`https://stemn.com/projects/${data.stub}/settings`);
    },
    viewSyncSettingsOnline(e, data) {
      shell.openExternal(`https://stemn.com/projects/${data.stub}/settings/sync`);
    },
    viewTeamSettingsOnline(e, data) {
      shell.openExternal(`https://stemn.com/projects/${data.stub}/settings/team`);
    },
    openExplorer(e, data) {
      this.props.SystemActions.openFileLocation({projectId: data._id, path: ''})
    },
    render() {
      return (
        <ContextMenu identifier="multi">
          <MenuItem onClick={this.viewOnline}>View Online</MenuItem>
          <MenuItem onClick={this.openExplorer}>Open in explorer</MenuItem>
          <SubMenu title="Project Settings">
            <MenuItem onClick={this.viewGeneralSettingsOnline}>General Settings</MenuItem>
            <MenuItem onClick={this.viewSyncSettingsOnline}>Sync Settings</MenuItem>
            <MenuItem onClick={this.viewTeamSettingsOnline}>Team and Permissions</MenuItem>
          </SubMenu>
          <MenuItem onClick={this.viewGeneralSettingsOnline}>Delete Project</MenuItem>
        </ContextMenu>
      );
    }
});

const ConnectedMenu = contextConnect(Menu);

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    SystemActions : bindActionCreators(SystemActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedMenu);
