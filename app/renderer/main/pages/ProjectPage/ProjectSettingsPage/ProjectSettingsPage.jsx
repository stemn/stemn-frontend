import React, { Component } from 'react';

// Components
import Tabs from 'app/renderer/main/components/Tabs/Tabs'
import Toggle from 'app/renderer/main/components/Input/Toggle/Toggle'

// Styles
import classNames from 'classnames';
//import pageStyles from './ProjectPage.css'
import tabsStyles from 'app/renderer/main/components/Tabs/Tabs.css'


const PageStyles = {
  padding: '20px 40px'
}

export default class extends React.Component{
  componentWillMount() {
//    this.props.ProjectsActions.getProject({stub: this.props.params.stub})
  }
  componentWillReceiveProps(nextProps) {
//    if (nextProps.params.stub !== this.props.params.stub) {
//      this.props.ProjectsActions.getProject({stub: nextProps.params.stub})
//    }
  }
  render() {
    return (
      <div className="layout-column flex rel-box" style={PageStyles}>
        
        <br />
        <br />
        <Toggle />
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius quasi, dicta. Aliquam excepturi obcaecati saepe corporis placeat, maiores quo dicta ipsum accusamus voluptatem dolor, sint, quis, quibusdam consequatur quod culpa.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius quasi, dicta. Aliquam excepturi obcaecati saepe corporis placeat, maiores quo dicta ipsum accusamus voluptatem dolor, sint, quis, quibusdam consequatur quod culpa.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius quasi, dicta. Aliquam excepturi obcaecati saepe corporis placeat, maiores quo dicta ipsum accusamus voluptatem dolor, sint, quis, quibusdam consequatur quod culpa.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius quasi, dicta. Aliquam excepturi obcaecati saepe corporis placeat, maiores quo dicta ipsum accusamus voluptatem dolor, sint, quis, quibusdam consequatur quod culpa.</p>
      </div>
    );
  }
};

//        <Tabs>
//          <a className={tabsStyles.active}>General Settings</a>
//          <a>Team Settings</a>
//        </Tabs>