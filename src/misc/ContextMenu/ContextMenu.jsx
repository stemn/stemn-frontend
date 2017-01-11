import React from 'react';
import classNames from 'classnames';
import { ContextMenu, MenuItem, SubMenu, connect} from "react-contextmenu";
import './ContextMenu.global.css';

const AdvancedMenuItem = React.createClass({
    render() {
      const { menuItem, item } = this.props;
      if(menuItem.subMenu){
        return (
          <SubMenu title={menuItem.label}>
            {menuItem.subMenu.map(subItem => <AdvancedMenuItem key={subItem.label} menuItem={subItem} item={item}/>)}
          </SubMenu>
        )
      }
      else{
        const attributes = {
          className: classNames({'divider': menuItem.divider})
        }
        return !menuItem.isHidden || !menuItem.isHidden(item)
          ? (
            <MenuItem key={menuItem.label}
              attributes={attributes}
              onClick={menuItem.onClick ? ()=>{menuItem.onClick(item)} : () => {}}>
              {menuItem.label}
            </MenuItem>
          )
          : null
      }
    }
});

const Menu = React.createClass({
    displayName: "Menu",
    render() {
      const { menu, identifier, item } = this.props;
      return (
        <ContextMenu identifier={identifier}>
          {menu ? menu.map(menuItem => <AdvancedMenuItem key={menuItem.label} menuItem={menuItem} item={item}/>) : null}
        </ContextMenu>
      );
    }
});

export default connect(Menu);
