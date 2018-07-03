import React from 'react'
import PropTypes from 'prop-types'
import { omit } from 'lodash'

const propTypesObject = {
  children: PropTypes.node.isRequired,      // Child element
  zoomIn: PropTypes.func.isRequired,      // Zoom function - This is run once on each scroll
  zoomOut: PropTypes.func.isRequired,      // Zoom function - This is run once on each scroll
}

class ScrollZoom extends React.Component {
  componentDidMount() {
    this.refs.container.addEventListener('DOMMouseScroll', this.handleMouseWheel)
    this.refs.container.addEventListener('mousewheel',     this.handleMouseWheel)
  }

  componentWillUnmount() {
    this.refs.container.removeEventListener('DOMMouseScroll', this.handleMouseWheel)
    this.refs.container.removeEventListener('mousewheel',     this.handleMouseWheel)
  }

  handleMouseWheel = (evt) => {
    if (evt.ctrlKey) {
      if (evt.wheelDelta < 0) { // Zoom Out
        if (this.props.zoomOut) this.props.zoomOut()
      } else if (evt.wheelDelta > 0) { // Zoom In
        if (this.props.zoomIn) this.props.zoomIn()
      }
      // Only zoom the pages, not the entire viewer.
      evt.preventDefault()
    }
  };

  render() {
    const { children } = this.props

    return (
      <div ref="container" { ...omit(this.props, Object.keys(propTypesObject)) }>
        {children}
      </div>
    )
  }
}

export default ScrollZoom
