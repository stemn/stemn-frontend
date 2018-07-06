import React from 'react'
import cn from 'classnames'
import Popover from 'stemn-shared/misc/Popover/Popover'
import Link from 'stemn-shared/misc/Router/Link'
import { pick } from 'lodash'

const MenuItem = (props) => {
  const { menuItem, item } = props

  if (!menuItem.isHidden || !menuItem.isHidden(item)) {
    if (menuItem.submenu) {
      return (
        <Popover preferPlace="right" trigger="hoverDelay" tipSize={ 0 } offset={ 0 }>
          <div>
            <Link
              onClick={ () => menuItem.onClick && menuItem.onClick(item) }
              className={ cn({ divider: menuItem.divider }, 'submenu') }
              { ...pick(menuItem, ['name', 'params', 'query']) }
            >
              {menuItem.label}
            </Link>
          </div>
          <div><Menu menu={ menuItem.submenu } /></div>
        </Popover>
      )
    }
    
    return (
      <Link
        onClick={ () => menuItem.onClick && menuItem.onClick(item) }
        className={ cn({ divider: menuItem.divider }) }
        { ...pick(menuItem, ['name', 'params', 'query']) }
      >
        {menuItem.label}
      </Link>
    )
  }
  
  return null
}

const Menu = (props) => {
  const { menu, item, ...otherProps } = props
  // Menu - standard menu object
  // Item - the thing that will be passed into menuitem.onclick
  return (
    <div className="PopoverMenu" { ...otherProps }>
      {menu.map(menuItem => <MenuItem key={ menuItem.key || menuItem.label } menuItem={ menuItem } item={ item } />)}
    </div>
  )
}

export default Menu
