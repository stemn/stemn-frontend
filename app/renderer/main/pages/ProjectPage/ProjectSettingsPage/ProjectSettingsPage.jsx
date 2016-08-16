import React, { Component } from 'react';

// Components
import Tabs from 'app/renderer/main/components/Tabs/Tabs'
import Toggle from 'app/renderer/main/components/Input/Toggle/Toggle'

// Styles
import classNames from 'classnames';


const PageStyles = {
  padding: '20px 40px'
}

export default class extends React.Component{
  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {

  }
  render() {
    const team = this.props.project.team.map((item)=>
      <div className="layout-row layout-align-start-center">
        <div>Picture</div>
        <div className="flex">
          <div>{item.name}</div>
          <div>Owner: Can do everything</div>
        </div>
      </div>
    )
    return (
      <div className="layout-column flex rel-box" style={PageStyles}>
        {team}
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
