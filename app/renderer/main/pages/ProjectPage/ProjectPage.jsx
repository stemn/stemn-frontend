import React, { Component } from 'react';

// Styles
import classNames from 'classnames';


export default class extends React.Component{
  componentWillMount() {
    this.props.ProjectsActions.getProject({stub: this.props.params.stub})
  }
  render() {
    const topSection = () => {
      if(this.props.project){
        return (
          <div>
            <h3>{this.props.project.name}</h3>
            <h4>{this.props.project.blurb}</h4>
          </div>
        )
      }
    }
    return (
      <div className="layout-column flex rel-box">
        {topSection()}
        {this.props.children}
      </div>
    );
  }
};
