import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './Reactions.css';

import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
import { MdInsertEmoticon } from 'react-icons/lib/md';

import { options, groupAndOrderReactions } from './Reactions.utils.js';


export default React.createClass({
  render(){
    const { reactions } = this.props;
    const groupedReactions = reactions && reactions.length > 0 ? groupAndOrderReactions(reactions, options) : [];
    return (
      <span>
        {groupedReactions.map(reaction => <PopoverMenu key={reaction.name} preferPlace="below" trigger="hover">
          <img className={classes.icon} src={reaction.path}/>
          <div className="PopoverMenu">
          </div>
        </PopoverMenu>)}
      </span>
    );
  }
});

//            {reaction.list.map(userReaction => <div key={userReaction.owner._id}>{userReaction.owner.name}</div>)}
