import React from 'react';
import classNames from 'classnames';
import PopoverMenu from 'electron/app/renderer/main/components/PopoverMenu/PopoverMenu';

const MenuItem = React.createClass({
  render() {
    const { menuItem, item } = this.props;
    const el = null;

    if(!menuItem.isHidden || !menuItem.isHidden(item)){
      if(menuItem.submenu){
        return (
          <PopoverMenu preferPlace="right" trigger="hoverDelay" tipSize={0} offset={0}>
            <div>
              <a onClick={() => menuItem.onClick(item)}
              className={classNames({'divider': menuItem.divider}, 'submenu')}>
                {menuItem.label}
              </a>
            </div>
            <div><Menu menu={menuItem.submenu}/></div>
          </PopoverMenu>
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
    const { menu, onClick, item } = this.props;
    // Menu - standard menu object
    // Item - the thing that will be passed into menuitem.onclick
    return (
      <div className="PopoverMenu" onClick={onClick}>
        {menu.map(menuItem => <MenuItem key={menuItem.label} menuItem={menuItem} item={item}/>)}
      </div>
    );
  }
})

export default Menu;
