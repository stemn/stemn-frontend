import React, { Component, PropTypes } from 'react'

import classNames from 'classnames'

export default class AccordianAnimate extends Component {
  static propTypes = {
    innerHeight: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    items: PropTypes.node,
  }
  render() {
    const { itemHeight, items, children, style, duration, ...otherProps } = this.props
    const childItems = items || children
    
    const getNumChildren = () => {
      if (childItems) {
        const childItemsLength = childItems.length
        return childItemsLength === undefined ? 1 : childItemsLength
      } else {
        return 0
      }
    }
    
    const numChildren = getNumChildren()
    const containerHeight = itemHeight * numChildren
    const containerStyle = {
      height: `${containerHeight}px`,
      transition: `${duration}ms ease height`,
      overflow: 'hidden',
    }
        
    return (
      <div style={ { ...style, ...containerStyle} } {  ...otherProps }>
        { children }
      </div>
    )
  }
}

