import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './Reactions.css';

import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
import { MdInsertEmoticon } from 'react-icons/lib/md';

import confused    from './emoji/one/confused.png'
import party       from './emoji/one/party.png'
import thumbs_up   from './emoji/one/thumbs_up.png'
import thumbs_down from './emoji/one/thumbs_down.png'
import heart       from './emoji/one/heart.png'

export default React.createClass({
  render(){
    const { submitFn, reactions } = this.props;

    const options = [{
      path: confused,
      name: 'confused'
    },{
      path: thumbs_up,
      name: 'up'
    },{
      path: thumbs_down,
      name: 'down'
    },{
      path: party,
      name: 'party'
    },{
      path: heart,
      name: 'heart'
    }]

    return (
      <PopoverMenu preferPlace={this.props.preferPlace}>
        <SimpleIconButton style={{padding: '0'}}>
          <MdInsertEmoticon size="20px" />
        </SimpleIconButton>
        <div className="PopoverMenu">
          {options.map(option => <img
            onClick={()=>submitFn(option.name)}
            key={option.name}
            className={classes.popupIcon}
            src={option.path}
          />)}
        </div>
      </PopoverMenu>
    );
  }
});
