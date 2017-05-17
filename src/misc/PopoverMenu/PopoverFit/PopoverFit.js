import React, { Component } from 'react'
import { connect } from 'react-redux'
import Popover from 'stemn-shared/misc/Popover'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import classNames from 'classnames'

export default class PopoverFit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minWidth: 0,
    }
  }
  getButtonRef = (ref) => {
    if (ref) {
      this.buttonRef = ref
    }
  }
  setWidth = () => {
    if (this.buttonRef) {
      this.setState({
        minWidth: this.buttonRef.clientWidth,
      })
    }
  }
  componentWillReceiveProps() {
    this.setWidth()
  }
  render() {
    const { children, max, style, className, ...otherProps } = this.props
    const { minWidth } = this.state

    const popoverStyle = {
      minWidth: `${minWidth}px`,
      maxWidth: max ? `${minWidth}px` : 'inherit',
    }

    return (
      <Popover preferPlace="below" tipSize={ 1 }  { ...otherProps }>
        <Button className={ classNames('light', className) } style={ style } buttonRef={ this.getButtonRef }>
          { children[0] }
        </Button>
        <div style={ popoverStyle }>
          { children[1] }
        </div>
      </Popover>
    )
  }
}
