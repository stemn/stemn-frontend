// Local replacement for react-popover-wrapper 2.x (which wraps react-popover).
// Same API: children[0] is the trigger, children[1] is the popover content.
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PopoverCore from './PopoverCore.jsx'
import './Popover.css'

export default class Popover extends Component {
  static propTypes = {
    // The prefered location of the popover
    preferPlace: PropTypes.oneOf(['above', 'below', 'left', 'right', 'start', 'end', 'row', 'column']),
    // Is the popover open? Often used with trigger === 'none' to control state externally
    open: PropTypes.bool,
    // The type of event to trigger the popver
    trigger: PropTypes.oneOf(['click', 'hover', 'hoverDelay', 'hoverSingleDelay', 'none']),
    // Toggle delay period. To be used with 'hoverDelay' or 'hoverSingleDelay'.
    toggleDelayTime: PropTypes.number,
    // This will stop the popup closing when the popover content is clicked.
    disableClickClose: PropTypes.bool,
    // Size of the arrow.
    tipSize: PropTypes.number,
    // Distance between the tip and the target
    offset: PropTypes.number,
    // Should the popup content inherit the 'isOpen' prop?
    inheritIsOpen: PropTypes.bool,
    // Two children should be passed in - children[0] is the trigger, children[1] is the popup content
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {
    tipSize: 6,
    trigger: 'click',
    preferPlace: 'above',
    toggleDelayTime: 200,
  }

  constructor(props) {
    super(props)
    this.state = {
      isOpen: props.open === true,
    }
    this.toggleDelayTimeout = null
  }

  componentWillUnmount() {
    clearTimeout(this.toggleDelayTimeout)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { open } = nextProps
    if (open === true || open === false) {
      this.setState({ isOpen: open })
    }
  }

  toggleDelay = (toState) => {
    clearTimeout(this.toggleDelayTimeout)
    this.toggleDelayTimeout = setTimeout(() => {
      this.toggle(toState)
    }, this.props.toggleDelayTime)
  }

  toggle = (toState) => {
    // Toggle isOpen to the toState (toState === null will toggle)
    this.setState(({ isOpen }) => {
      const newValue = toState === null ? !isOpen : toState
      return isOpen !== newValue ? { isOpen: newValue } : null
    })
  }

  outerAction = () => {
    if (this.props.trigger !== 'none') {
      this.toggle(false)
    }
  }

  getTriggerEventBinds = (triggerType) => {
    const events = {
      // Standard hover trigger
      hover: {
        onMouseEnter: () => { this.toggle(true) },
        onMouseLeave: () => { this.toggle(false) },
      },
      // Delay open/close toggle
      hoverDelay: {
        onMouseEnter: () => { this.toggleDelay(true) },
        onMouseLeave: () => { this.toggleDelay(false) },
      },
      // Only trigger on the parent (not sub elements)
      hoverSingleDelay: {
        onMouseEnter: () => { this.toggleDelay(true) },
        onMouseOut: () => { this.toggleDelay(false) },
      },
      // Standard click trigger
      click: {
        onClick: () => { this.toggle(null) },
        onContextMenu: (e) => {
          e.preventDefault()
          this.toggle(null)
        },
      },
      // No trigger (to be used with props.open)
      none: {},
    }
    return events[triggerType] || {}
  }

  getPopoverEventBinds = (triggerType) => {
    const events = {
      hover: {},
      hoverDelay: {
        onMouseEnter: () => { this.toggleDelay(true) },
        onMouseLeave: () => { this.toggleDelay(false) },
      },
      click: {
        onClick: () => { if (!this.props.disableClickClose) this.toggle(false) },
      },
      none: {},
    }
    return events[triggerType] || {}
  }

  render() {
    const { preferPlace, trigger, tipSize, offset, inheritIsOpen } = this.props
    const children = Array.isArray(this.props.children) ? this.props.children : [this.props.children]
    const { isOpen } = this.state

    // Get the event bind props
    const triggerProps = this.getTriggerEventBinds(trigger)
    const contentProps = this.getPopoverEventBinds(trigger)

    // Add the 'isOpen' prop to the content if 'inheritIsOpen'
    const contentPropsWithInherit = inheritIsOpen
      ? { ...contentProps, isOpen }
      : contentProps

    const contentElement = React.isValidElement(children[1])
      ? React.cloneElement(children[1], contentPropsWithInherit)
      : (children[1] || '')

    const triggerElement = React.isValidElement(children[0])
      ? React.cloneElement(children[0], triggerProps)
      : (children[0] || '')

    return (
      <PopoverCore
        isOpen={ isOpen }
        body={ contentElement }
        onOuterAction={ this.outerAction }
        preferPlace={ preferPlace }
        tipSize={ tipSize }
        offset={ offset }
      >
        { triggerElement }
      </PopoverCore>
    )
  }
}
