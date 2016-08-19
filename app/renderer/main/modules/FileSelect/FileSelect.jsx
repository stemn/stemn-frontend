// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as FileSelectActions from './FileSelect.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './FileSelect.css'

// Sub Components
import FileBreadCrumbs from './components/FileBreadCrumbs';
import FileRow from './components/FileRow';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  componentWillMount() {
    this.props.FileSelectActions.fetchFiles({
      projectId: this.props.projectId,
      path: this.props.path
    });
  },
  singleClick({file}){
    console.log('single', file);
  },
  doubleClick({file}){
    console.log('double', file);
  },
  crumbClickFn({item}){
    console.log({item});
  },
  render() {
    console.log(this.props);
    const {files} = this.props;
    const crumbs = [
      {
        text: 'HOME',
      },{
        text: 'STEMN',
      },{
        text: 'FOLDER',
      }
    ]

    return (
      <div>
        <div className={classes.breadcrumbs}>
          <FileBreadCrumbs crumbs={crumbs} clickFn={this.crumbClickFn}/>
        </div>
        {files.data.length > 0
          ? files.data.map((file)=><FileRow file={file} singleClick={this.singleClick} doubleClick={this.doubleClick} isActive={false}/>)
          : <div>Loading</div>
        }
      </div>
    );
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({fileSelect}, {projectId, path}) {
  return {
    files: fileSelect[`${projectId}/${path}`],
    projectId,
    path
  };
}

function mapDispatchToProps(dispatch) {
  return {
    FileSelectActions: bindActionCreators(FileSelectActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
