import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc';

import { getProject } from 'stemn-shared/misc/Projects/Projects.actions';

import Project from './Project';
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';

const stateToProps = (state, { params, location }) => ({
  project: state.projects.data[params.stub],
  pathname: location.pathname
});

const dispatchToProps = {
  getProject
};

const fetchConfigs = [{
  hasChanged: 'params.stub',
  onChange: (props) => {
    props.getProject({projectId: props.params.stub})
  }
}];

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
class ProjectContainer extends Component {
  render() {
    const isLoaded = this.props.project && this.props.project.data;
    return (
      <div className='layout-column flex'>
        <LoadingOverlay show={ !isLoaded } hideBg/>
        { isLoaded 
        ? <Project {...this.props} />
        : null }
      </div>
    );
  }
}

export default ProjectContainer