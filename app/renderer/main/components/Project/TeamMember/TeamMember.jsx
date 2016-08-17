import React from 'react';

// Components
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx'

import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'

import {MdMoreHoriz} from 'react-icons/lib/md';


// Styles
import classNames from 'classnames';

export default class extends React.Component{
  render() {
    return (
      <div className="layout-row layout-align-start-center">
        <UserAvatar picture={this.props.item.picture} size="40px"/>
        <div className="flex" style={{marginLeft: '15px'}}>
          <div className="text-bold" style={{marginBottom: '5px'}}>{this.props.item.name}</div>
          <div className="text-description-1">Owner: Can do everything</div>
        </div>
        <SimpleIconButton>
          <MdMoreHoriz size="20px"/>
        </SimpleIconButton>
      </div>
    );
  }
};
