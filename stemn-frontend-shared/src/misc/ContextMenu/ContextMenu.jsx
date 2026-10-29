import React from 'react'
import cn from 'classnames'
import {
  ContextMenu,
  MenuItem,
  SubMenu,
  ContextMenuTrigger as BaseContextMenuTrigger,
} from '@firefox-devtools/react-contextmenu'
import './ContextMenu.global.css'

// The trigger passes its `item` prop through to the menu (via `collect`)
const collectItem = props => ({ item: props.item })

export const ContextMenuTrigger = props => (
  <BaseContextMenuTrigger collect={ collectItem } { ...props } />
)

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

export default class Menu extends React.Component {
  state = {
    trigger: null,
  }

  // The show event detail.data holds the data returned by the trigger's `collect`
  onShow = (event) => {
    this.setState({ trigger: (event && event.detail && event.detail.data) || null })
  }

  onHide = () => {
    this.setState({ trigger: null })
  }

  render() {
    const { menu, identifier } = this.props
    const { trigger } = this.state
    return (
      <ContextMenu id={ identifier } onShow={ this.onShow } onHide={ this.onHide }>
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
