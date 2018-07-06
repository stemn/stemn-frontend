import React from 'react'
import cn from 'classnames'
import { ContextMenu, MenuItem, SubMenu, connectMenu } from 'react-contextmenu'
import './ContextMenu.global.css'

class AdvancedMenuItem extends React.Component {
  render() {
    const { menuItem, item } = this.props
    if (menuItem.subMenu) {
      return (
        <SubMenu title={ menuItem.label }>
          { menuItem.subMenu.map(subItem => (
            <AdvancedMenuItem 
              key={ subItem.label } 
              menuItem={ subItem } 
              item={ item } 
            />
          )) }
        </SubMenu>
      )
    }
      
    const attributes = {
      className: cn({ divider: menuItem.divider }),
    }

    return !menuItem.isHidden || !menuItem.isHidden(item)
      ? (
        <MenuItem
          key={ menuItem.label }
          attributes={ attributes }
          onClick={ menuItem.onClick ? () => { menuItem.onClick(item) } : () => {} }
        >
          {menuItem.label}
        </MenuItem>
      )
      : null
  }
}

@connectMenu()
export default class Menu extends React.Component {
  render() {
    const { menu, identifier, trigger } = this.props
    return (
      <ContextMenu id={ identifier }>
        { menu && trigger
          ? menu.map(menuItem => (
            <AdvancedMenuItem 
              key={ menuItem.label } 
              menuItem={ menuItem } 
              item={ trigger.item } 
            />
          )) 
          : null }
      </ContextMenu>
    )
  }
}
