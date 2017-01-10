import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './TimelineInner.css';

import moment from 'moment';
import Popover from 'stemn-shared/misc/Popover';
import PopoverMenu from 'stemn-shared/misc/PopoverMenu/PopoverMenu';

import * as stringConcat from 'stemn-shared/utils/stringConcat';


const EventMap = {
  commit   : (item) => {
    const timeFromNow = moment(item.timestamp).fromNow();
    return (
      <div className={classes.popup + ' layout-row layout-align-start-center'}>
        <img className={classes.popupImage} src={'https://stemn.com' + item.user.picture + '?size=thumb&crop=true'} />
        <div className="flex">
          <b>{stringConcat.end(item.data.summary, 30)}</b>
          <div>{timeFromNow} by {item.user.name}</div>
        </div>
      </div>
    )
  },
  revision : (item) => {
    const timeFromNow = moment(item.timestamp).fromNow();
    return (
      <div className={classes.popup + ' layout-row layout-align-start-center'}>
        <img className={classes.popupImage} src={'https://stemn.com' + item.user.picture + '?size=thumb&crop=true'} />
        <div className="flex">
          <b>{stringConcat.end(item.data.name, 30)}</b>
          <div>{timeFromNow} by {item.user.name}</div>
        </div>
      </div>
    )
  }
}

const PopupContent = (item) =>{
  const PopupInner = EventMap[item.event];
  return PopupInner ? PopupInner(item) : 'Unknown event type';
}

const Component = React.createClass({
  render() {
    const { numberToShow, items, selected, isSelected, page, onSelect, preferPlace, size} = this.props;
    const translation = 'translateX(' + page * 100 + '%)';
    const Items = items.map((item, index)=> {
      const percentage = 100 - (index) * (100 / numberToShow);
      const posStyle = {left: percentage+'%'};
      return (
        <a key={item._id}
          // If the isSelected function is provided, we use this to determine if the item is active
          className={classNames(classes.dot, {[classes.active]: isSelected ? isSelected(item) : selected == item._id})}
          style={posStyle}
          onClick={()=>onSelect(item)}>
          <PopoverMenu preferPlace={preferPlace || 'below'} trigger="hover">
            <div style={{width: '100%', height: '100%'}}></div>
            <div>{PopupContent(item)}</div>
          </PopoverMenu>
        </a>
      )
    });

    return(
      <div className={classNames(classes.dots, {[classes.small]: size == 'sm'})} style={{transform: translation}}>
        {Items}
      </div>
    )
  }
});

export default Component
