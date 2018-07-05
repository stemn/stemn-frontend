import React from 'react'
import cn from 'classnames'
import classes from './TimelineInner.css'
import { orderByTime } from '../Timeline.utils'
import moment from 'moment'
import Popover from 'stemn-shared/misc/Popover'
import * as stringConcat from 'stemn-shared/utils/stringConcat'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'

const EventMap = {
  commit: (item) => {
    const timeFromNow = moment(item.timestamp).fromNow()
    return (
      <div className={ cn(classes.popup, 'layout-row layout-align-start-center') }>
        <UserAvatar
          className={ classes.popupImage }
          picture={ item.user.picture }
          name={ item.user.name }
          shape="square"
          size={ 40 }
        />
        <div className="flex">
          <b>Commit: { stringConcat.end(item.data.name, 25) }</b>
          <div className="text-grey-3">{ timeFromNow } by { item.user.name }</div>
        </div>
      </div>
    )
  },
  revision: (item) => {
    const timeFromNow = moment(item.timestamp).fromNow()
    return (
      <div className={ cn(classes.popup, 'layout-row layout-align-start-center') }>
        <UserAvatar
          className={ classes.popupImage }
          picture={ item.user.picture }
          name={ item.user.name }
          shape="square"
          size={ 40 }
        />
        <div className="flex">
          <b>Revision: { item.data.revisionNumber }</b>
          <div className="text-grey-3">{ timeFromNow } by { item.user.name }</div>
        </div>
      </div>
    )
  },
}

const PopupContent = (item) => {
  const PopupInner = EventMap[item.event]
  return PopupInner ? PopupInner(item) : 'Unknown event type'
}

class Dot extends React.Component {
  render() {
    const { isSelected, selected, onSelect, item, preferPlace } = this.props
    const dotClasses = cn(classes.dot, { [classes.active]: isSelected ? isSelected(item) : selected === item._id })
    return (
    // If the isSelected function is provided, we use this to determine if the item is active
      <a className={ dotClasses } onClick={ () => onSelect(item) }>
        <Popover preferPlace={ preferPlace || 'below' } trigger="hoverDelay" tipSize={ 6 }>
          <div className="layout-column layout-align-center-center" style={ { height: '100%' } } />
          <div>{ PopupContent(item) }</div>
        </Popover>
      </a>
    )
  }
}

class Component extends React.Component {
  render() {
    const { items, selected, isSelected, page, onSelect, preferPlace, size, refInner } = this.props
    const translation = `translateX(${page * 100}%)`
    
    const Items = items.map((item, index) => {
      if (item.event === 'commit') {
        // Order the items by the timestamp
        const subItemsOrdered = orderByTime(item.data.items).reverse()

        // These are reversed because they go left to right (not right to left like the other items)
        return (
          <Popover preferPlace={ preferPlace || 'below' } trigger="hoverSingleDelay" tipSize={ 6 }>
            <div key={ item._id }  className={ cn(classes.dotGroup, 'layout-row layout-align-center-center') }>
              { subItemsOrdered.map(subItem => (
                <Dot
                  key={ subItem._id }
                  item={ subItem }
                  isSelected={ isSelected }
                  selected={ selected }
                  onSelect={ onSelect }
                  preferPlace={ preferPlace }
                />
              )) }
            </div>
            <div>{PopupContent(item)}</div>
          </Popover>
        )
      }
      
      return (
        <Dot 
          key={ item._id } 
          item={ item } 
          isSelected={ isSelected } 
          selected={ selected } 
          onSelect={ onSelect } 
          preferPlace={ preferPlace }
        />
      )
    })
  
    
    const containerClasses = cn('layout-row layout-align-end-center', classes.dots, { [classes.small]: size === 'sm' })
    return (
      <div ref={ refInner } className={ containerClasses } style={ { transform: translation } }>
        { Items }
      </div>
    )
  }
}

export default Component
