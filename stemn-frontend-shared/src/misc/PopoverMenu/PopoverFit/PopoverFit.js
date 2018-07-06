import React, { Component } from 'react'
import Popover from 'stemn-shared/misc/Popover'

export default class PopoverFit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minWidth: 0,
    }
  }
  getTriggerRef = (ref) => {
    // If we have ref.props - this is a react component
    // the childRef prop should be implemented for react components
    if (ref && !ref.props) {
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
    
    const triggerWithRefProp = (element) => {
      // This will add the ref prop to the trigger element
      const newProps = {
        childRef: this.getTriggerRef, // This childRef prop should be implemented if the child is a component
        ref: this.getTriggerRef,
      }
      return React.cloneElement(element, newProps)
    }    
    
    return (
      <Popover preferPlace="below" tipSize={ 1 }  { ...otherProps }>
        { triggerWithRefProp(children[0]) }
        <div style={ popoverStyle }>
          { children[1] }
        </div>
      </Popover>
    )
  }
}

//        <div ref={ this.getTriggerRef } className="layout-row flex">
//        </div>