import React, { Component } from 'react';
import { ContextMenu, MenuItem, SubMenu, connect} from "react-contextmenu";

import { shell } from 'electron';
import os from 'os';

const Menu = React.createClass({
    displayName: "Menu",
    openExplorer(e, data) {
      shell.showItemInFolder(os.homedir())
    },
    render() {
      return (
        <ContextMenu identifier={this.props.identifier}>
          <MenuItem onClick={this.openExplorer}>Discard Changes</MenuItem>
          <MenuItem onClick={this.openExplorer}>Open preview</MenuItem>
          <MenuItem onClick={this.openExplorer}>Open in explorer</MenuItem>
          <MenuItem onClick={this.openExplorer}>Open containing folder</MenuItem>
        </ContextMenu>
      );
    }
});

export default connect(Menu);
