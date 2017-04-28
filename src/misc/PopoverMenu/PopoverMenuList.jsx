import React from 'react';
import classNames from 'classnames';
import Popover from 'stemn-shared/misc/Popover/Popover';

const MenuItem = React.createClass({
  render() {
    const { menuItem, item } = this.props;
    const el = null;

    if(!menuItem.isHidden || !menuItem.isHidden(item)){
      if(menuItem.submenu){
        return (
          <Popover preferPlace="right" trigger="hoverDelay" tipSize={0} offset={0}>
            <div>
              <a onClick={() => menuItem.onClick(item)}
              className={classNames({'divider': menuItem.divider}, 'submenu')}>
                {menuItem.label}
              </a>
            </div>
            <div><Menu menu={menuItem.submenu}/></div>
          </Popover>
        );
      }
      else{
        return (
          <a onClick={() => menuItem.onClick(item)}
          className={classNames({'divider': menuItem.divider})}>
            {menuItem.label}
          </a>
        );
      }
    }
    else{
      return null
    }
  }
})

const Menu = React.createClass({
  render() {
    const { menu, item, ...otherProps } = this.props;
    // Menu - standard menu object
    // Item - the thing that will be passed into menuitem.onclick
    return (
      <div className="PopoverMenu" { ...otherProps }>
        {menu.map(menuItem => <MenuItem key={menuItem.label} menuItem={menuItem} item={item}/>)}
      </div>
    );
  }
})

export default Menu;
