import React from 'react';
import classNames from 'classnames';
import SimpleIconButton from 'stemn-frontend-shared/src/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import PopoverMenu from 'stemn-frontend-shared/src/misc/PopoverMenu/PopoverMenu';
import MdMoreHoriz from 'react-icons/md/more-horiz';
import Input from 'stemn-frontend-shared/src/misc/Input/Input/Input';

import classes from './TaskGroup.css'
export default class TaskGroup extends React.Component {
  render() {
    const { item, children, layout, entityModel, deleteGroup, updateGroup, simpleGroup } = this.props;

    const headerClasses = classNames(classes.header, layout == 'list' ? classes.headerList : classes.headerBoard, 'layout-row layout-align-start-center');
    
    if(simpleGroup){
      return (
        <div className={layout == 'list' ? classes.wrapperList : classes.wrapperBoard}>
          <div className={headerClasses}></div>
          <div className={layout == 'list' ? classes.contentList : classes.contentBoard}>
            {children}
          </div>
        </div>
      );
    }
    else{
      return (
        <div className={layout == 'list' ? classes.wrapperList : classes.wrapperBoard + ' layout-column'}>
          <div className={headerClasses}>
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
          <div className={layout == 'list' ? classes.contentList : classes.contentBoard}>
            {children}
          </div>
        </div>
      );
    }
  }
}
