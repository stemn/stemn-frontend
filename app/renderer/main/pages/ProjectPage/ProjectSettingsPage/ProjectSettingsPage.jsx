import React from 'react';

// Components
import Tabs from 'app/renderer/main/components/Tabs/Tabs'
import Toggle from 'app/renderer/main/components/Input/Toggle/Toggle'
import UserSearch from 'app/renderer/main/modules/UserSearch/UserSearch.container.js'
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx'

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
  selectFn(selection){
    console.log(selection);
  }
  render() {
    const team = this.props.project.team.map((item)=>
      <div className="layout-row layout-align-start-center">
        <UserAvatar picture={item.picture} size="50px"/>
        <div className="flex">
          <div>{item.name}</div>
          <div>Owner: Can do everything</div>
        </div>
      </div>
    )
    return (
      <div className="layout-column flex rel-box" style={PageStyles}>
        {team}
        <UserSearch select={this.selectFn} />
        <br />
        <br />
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius quasi, dicta. Aliquam excepturi obcaecati saepe corporis placeat, maiores quo dicta ipsum accusamus voluptatem dolor, sint, quis, quibusdam consequatur quod culpa.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius quasi, dicta. Aliquam excepturi obcaecati saepe corporis placeat, maiores quo dicta ipsum accusamus voluptatem dolor, sint, quis, quibusdam consequatur quod culpa.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius quasi, dicta. Aliquam excepturi obcaecati saepe corporis placeat, maiores quo dicta ipsum accusamus voluptatem dolor, sint, quis, quibusdam consequatur quod culpa.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius quasi, dicta. Aliquam excepturi obcaecati saepe corporis placeat, maiores quo dicta ipsum accusamus voluptatem dolor, sint, quis, quibusdam consequatur quod culpa.</p>
      </div>
    );
  }
};

//        <Toggle />
