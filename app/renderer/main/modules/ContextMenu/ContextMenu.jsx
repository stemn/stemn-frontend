import React from 'react';
import { ContextMenu, MenuItem, SubMenu, connect} from "react-contextmenu";

const AdvancedMenuItem = React.createClass({
    render() {
      const { menuItem, item } = this.props;
      if(menuItem.subMenu){
        return (
          <SubMenu title={menuItem.label}>
            {menuItem.subMenu.map(subItem => <AdvancedMenuItem key={subItem.label} menuItem={subItem}/>)}
          </SubMenu>
        )
      }
      else{
        return <MenuItem key={menuItem.label} onClick={menuItem.onClick ? ()=>{menuItem.onClick(item)} : () => {}}>{menuItem.label}</MenuItem>
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
