import React, { Component } from 'react'
import { connect } from 'react-redux'
import Popover from 'stemn-shared/misc/Popover'
import classNames from 'classnames'

export default class PopoverFit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minWidth: 0,
    }
  }
  getTriggerRef = (ref) => {
    if (ref) {
      this.triggerRef = ref
      this.setWidth()
    }
  }
  setWidth = () => {
    if (this.triggerRef) {
      this.setState({
        minWidth: this.triggerRef.clientWidth,
      })
    }
  }
  componentWillReceiveProps() {
    this.setWidth()
  }
  render() {
    const { children, max, style, ...otherProps } = this.props
    const { minWidth } = this.state

    const popoverStyle = {
      minWidth: `${minWidth}px`,
      maxWidth: max ? `${minWidth}px` : 'inherit',
    }

    return (
      <Popover preferPlace="below" tipSize={ 1 }  { ...otherProps }>
        <div ref={ this.getTriggerRef }>
          { children[0] }
        </div>
        <div style={ popoverStyle }>
          { children[1] }
        </div>
      </Popover>
    )
  }
}
