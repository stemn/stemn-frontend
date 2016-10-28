import React from 'react';

import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import MdMoreHoriz from 'react-icons/md/more-horiz';
import Input from 'app/renderer/main/components/Input/Input/Input';

import classes from './TaskGroup.css'
export default class Component extends React.Component {
  render() {
    const { item, children, layout, entityModel, deleteGroup, updateGroup, simpleGroup } = this.props;

    const styles = layout == 'list' ? {
      marginBottom: '20px'
    } : {
      padding: '0 15px',
      width: '350px',
      minWidth: '350px',
    }
    if(simpleGroup){
      return (
        <div style={styles}>
          <div className={classes.header}></div>
          {children}
        </div>
      );
    }
    else{
      return (
        <div style={styles}>
          <div className={classes.header + ' layout-row layout-align-start-center'}>
            <h3 className="flex">
              <Input 
                model={`${entityModel}.name`}
                value={item.name}
                placeholder="Group name" 
                className="input-plain text-mini-caps" 
                type="text" 
                changeAction={()=>{setTimeout(updateGroup, 1)}} 
              />
            </h3>
            <div className={classes.options}>
              <PopoverMenu preferPlace="below">
                <SimpleIconButton>
                  <MdMoreHoriz size="20px"/>
                </SimpleIconButton>
                <div className="PopoverMenu">
                  <a onClick={deleteGroup}>Delete Group</a>
                </div>
              </PopoverMenu>
            </div>
          </div>
          {children}
        </div>
      );
    }
  }
}
