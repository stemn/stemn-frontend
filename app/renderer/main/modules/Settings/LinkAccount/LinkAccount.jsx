import React from 'react';

// Styles
import classNames from 'classnames';

import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
import {MdDone, MdLink, MdMoreHoriz} from 'react-icons/lib/md';

import classes from './LinkAccount.css';

export default class extends React.Component{
  render() {
    return (
      <div className={classes.row + ' layout-row layout-align-start-center'}>
        <div onClick={()=>{if(!this.props.isLinked){this.props.linkFn()}}} className="flex layout-row layout-align-start-center">
          {this.props.isLinked ? <MdDone size="22"/> : <MdLink size="20"/>}
          <div className='flex' style={{marginLeft: '10px'}}>{this.props.isLinked ? <span>Connected with {this.props.text}</span> : <span>Connect to {this.props.text}</span>}</div>
        </div>
        {
          this.props.isLinked
          ?
          <PopoverMenu preferPlace="right">
            <SimpleIconButton>
              <MdMoreHoriz size="20"/>
            </SimpleIconButton>
            <div className="PopoverMenu">
              <a onClick={this.props.unLinkFn}>Unlink</a>
            </div>
          </PopoverMenu>
          : ''
        }
      </div>
    );
  }
};
