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


export default React.createClass({
  componentWillMount() {
    this.props.ProjectsActions.getProject({projectId: this.props.params.stub});
    this.props.ChangeActions.fetchChanges({projectId: this.props.params.stub});
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.stub !== this.props.params.stub) {
      this.props.ProjectsActions.getProject({projectId: nextProps.params.stub});
      this.props.ChangeActions.fetchChanges({projectId: nextProps.params.stub});
    }
  },
  toggleAll(model, value){
    return this.props.ChangeActions.actToggleAll({
      model,
      value,
      projectId: this.props.project._id
    })
  },

  commitFn(){
    console.log(this.props.changes.data.filter((item)=>item.selected).map((item)=>item._id));
    this.props.ChangeActions.commit({
      projectId: this.props.project._id,
      revisions: this.props.changes.data.filter((item)=>item.selected).map((item)=>item._id),
      summary: this.props.changes.summary,
      description: this.props.changes.description
    })
  },

  render() {
    return (
      <div className="layout-column flex">
        <Toolbar>{this.props.project && this.props.project.name ? stringConcat.end(this.props.project.name, 28) : ''}</Toolbar>
        {this.props.changes && this.props.changes.data ? <CommitChanges changes={this.props.changes}
        project={this.props.project}
        actToggleAll={this.toggleAll}
        selectedFileChange={this.props.ChangeActions.selectedFileChange}/> : ''}
        { this.props.project && this.props.changes && this.props.changes.data
          ? <div style={commitBoxStyles}>
            <CommitBox changes={this.props.changes}
              changesActions={this.props.ChangeActions}
              commitFn={()=>this.commitFn()}
              project={this.props.project}/>
          </div>
          : <div className="layout-column layout-align-center-center flex">Could not get recent changes for this project</div>
        }
        <Sidebar />
      </div>
    );
  }
});


//

