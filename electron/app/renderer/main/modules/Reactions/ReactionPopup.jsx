import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './Reactions.css';

import PopoverMenu from 'electron/app/renderer/main/components/PopoverMenu/PopoverMenu';
import SimpleIconButton from 'electron/app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton.jsx'
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
