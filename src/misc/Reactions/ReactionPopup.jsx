import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './Reactions.css';

import PopoverMenu from 'stemn-frontend-shared/src/misc/PopoverMenu/PopoverMenu';
import SimpleIconButton from 'stemn-frontend-shared/src/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdInsertEmoticon from 'react-icons/md/insert-emoticon';

import { options } from './Reactions.utils.js';


export default React.createClass({
  render(){
    const { submitFn, reactions } = this.props;

    return (
      <PopoverMenu preferPlace={this.props.preferPlace}>
        <SimpleIconButton style={{padding: '0'}}>
          <MdInsertEmoticon size="20px" />
        </SimpleIconButton>
        <div className="PopoverMenu">
          {options.map(option => <span
            title={option.type}
            onClick={()=>submitFn(option.type)}
            key={option.type}
            className={classes.popupIcon}
           >
           {option.icon}
           </span>)}
        </div>
      </PopoverMenu>
    );
  }
});
