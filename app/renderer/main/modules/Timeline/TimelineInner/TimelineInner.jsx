import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './TimelineInner.css';

import moment from 'moment';
import Popover from 'app/renderer/assets/other/react-popup';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';

import * as stringConcat from 'app/shared/helpers/stringConcat';


const PopupContent = (item) =>{
  const timeFromNow = moment(item.timestamp).fromNow();
  return (
    <div className={classes.popup + ' layout-row layout-align-start-center'}>
      {/*<img className={classes.popupImage} src={'https://stemn.com' + item.user.picture + '?size=thumb&crop=true'} />*/}
      <div className="flex">
        {/*<b>{stringConcat.end(item.data.summary, 30)}</b> */}
        <div>{timeFromNow} by {item.user.name}</div>
      </div>

    </div>
  )
}

const Component = React.createClass({
  render() {
    const { numberToShow, items, selected, page, onSelect} = this.props;
    const translation = 'translateX(' + page * 100 + '%)';
    const Items = items.map((item, index)=> {
      const percentage = 100 - (index) * (100 / numberToShow);
      const posStyle = {left: percentage+'%'};
      return (
        <a key={item._id}
          className={classNames(classes.dot, {[classes.active]: selected == item._id})}
          style={posStyle}
          onClick={()=>onSelect(item)}>
          <PopoverMenu preferPlace="below" trigger="hover">
            <div style={{width: '100%', height: '100%'}}></div>
            <div>{PopupContent(item)}</div>
          </PopoverMenu>
        </a>
      )
    });

    return(
      <div className={classes.dots} style={{transform: translation}}>
        {Items}
      </div>
    )
  }
});

export default Component
