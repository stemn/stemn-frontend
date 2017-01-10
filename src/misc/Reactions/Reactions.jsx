import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './Reactions.css';

import PopoverMenu from 'stemn-shared/misc/PopoverMenu/PopoverMenu';
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdInsertEmoticon from 'react-icons/md/insert-emoticon';
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'

import { options, groupAndOrderReactions } from './Reactions.utils.js';


export default React.createClass({
  render(){
    const { reactions } = this.props;
    const groupedReactions = reactions && reactions.length > 0 ? groupAndOrderReactions(reactions, options) : [];
    return (
      <span>
        {groupedReactions.map(reaction => <PopoverMenu key={reaction.type} preferPlace="below" trigger="hover">
          <a className={classes.icon}>{reaction.icon}</a>
          <div className="PopoverMenu">
            {reaction.list.map(userReaction => <div className="layout-row layout-align-start-center" style={{padding: '5px'}} key={userReaction.owner._id}>
              <UserAvatar picture={userReaction.owner.picture} size={20}/>
              <div style={{marginLeft: '5px'}}>{userReaction.owner.name}</div>
            </div>)}
          </div>
        </PopoverMenu>)}
      </span>
    );
  }
});

