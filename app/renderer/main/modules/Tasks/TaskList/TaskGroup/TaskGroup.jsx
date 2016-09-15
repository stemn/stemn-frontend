import React from 'react';

import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import { MdMoreHoriz } from 'react-icons/lib/md';

import classes from './TaskGroup.css'
export default class Component extends React.Component {
  render() {
    const { item, children, layout } = this.props;

    const styles = layout == 'list' ? {
      marginBottom: '20px'
    } : {
      padding: '0 15px',
      width: '350px'
    }
    return (
      <div style={styles}>
        <div className={classes.header + ' layout-row layout-align-start-center'}>
          <h3 className="text-mini-caps flex">{item.name}</h3>
          <div className={classes.options}>
            <PopoverMenu preferPlace="below">
              <SimpleIconButton>
                <MdMoreHoriz size="20px"/>
              </SimpleIconButton>
              <div className="PopoverMenu">
                <a>Edit Group</a>
                <a>Delete Group</a>
              </div>
            </PopoverMenu>
          </div>
        </div>
        {children}
      </div>
    );
  }
}
