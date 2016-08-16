import React, { PropTypes } from 'react';
import CommitChanges from 'app/renderer/menubar/components/CommitChanges'
import CommitBox from 'app/renderer/menubar/components/CommitBox/CommitBox'
import Toolbar from 'app/renderer/menubar/containers/Toolbar'
import Sidebar from 'app/renderer/menubar/containers/Sidebar'

import * as stringConcat from 'app/shared/helpers/stringConcat';


const commitBoxStyles = {
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  background: 'rgba(0, 0, 0, 0.03)',
  marginTop: '-1px'
}


export default class extends React.Component{
  componentWillMount() {
    this.props.ProjectsActions.getProject({stub: this.props.params.stub})
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.stub !== this.props.params.stub) {
      this.props.ProjectsActions.getProject({stub: nextProps.params.stub})
    }
  }
  render() {
    return (
      <div className="layout-column flex">
        <Toolbar>{this.props.project && this.props.project.name ? stringConcat.end(this.props.project.name, 28) : ''}</Toolbar>
        <CommitChanges changes={this.props.changes} actToggleAll={this.props.ChangeActions.actToggleAll}/>
        <div style={commitBoxStyles}>
          <CommitBox changes={this.props.changes}/>
        </div>
        <Sidebar />
      </div>
    );
  }
};
