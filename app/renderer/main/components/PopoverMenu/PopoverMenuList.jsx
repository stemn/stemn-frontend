import React from 'react';
import classNames from 'classnames';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';

const MenuItem = React.createClass({
  render() {
    const { menuItem } = this.props;

    if(menuItem.submenu){
      return (
        <PopoverMenu preferPlace="right" trigger="hoverDelay" tipSize={0} offset={0}>
          <div>
            <a onClick={menuItem.onClick}
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
        <a onClick={menuItem.onClick}
        className={classNames({'divider': menuItem.divider})}>
          {menuItem.label}
        </a>
      );
    }
  }
})

const Menu = React.createClass({
  render() {
    const { menu } = this.props;
    return (
      <div className="PopoverMenu">
        {menu.map(menuItem => <MenuItem key={menuItem.label} menuItem={menuItem}/>)}
      </div>
    );
  }
})

export default Menu;
