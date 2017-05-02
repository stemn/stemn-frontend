import React, { Component } from 'react'
import { connect } from 'react-redux'
import { actions } from 'react-redux-form'
import Popover from 'stemn-shared/misc/Popover'
import MdExpandMore from 'react-icons/md/expand-more'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import classNames from 'classnames'

class PopoverDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minWidth: 0,
    }
  }
  getButtonRef = (ref) => {
    if (ref) {
      this.setState({
        minWidth: ref.clientWidth,
      })
    }
  }
  render() {
    const { children, options, model, value, dispatch, ...otherProps } = this.props
    const { minWidth } = this.state
    const currentOption = options.find(option => option.value === value)
    
    const popoverStyle = {
      minWidth: `${minWidth}px`
    }
    
    return (
      <Popover preferPlace="below" tipSize={ 1 }>
        <Button className="light" { ...otherProps } buttonRef={ this.getButtonRef }>
          { children }
          { currentOption && currentOption.name ? currentOption.name : 'none' }
          <div className="flex" />
          <MdExpandMore style={ { marginLeft: '5px' } } size={ 15 } />
        </Button>
        <div className="PopoverMenu" style={ popoverStyle }>
          { options.map((option) => {

            const onClick = model
              ? () => dispatch(actions.change(model, option.value))
              : () => option.onClick()

            return (
              <a
                key={ option.value }
                onClick={ onClick }
                className={ classNames({ 'active' : value === option.value }) }
              >
                { option.name }
              </a>
            )
          })}
        </div>
      </Popover>
    )
  }
}

export default connect()(PopoverDropdown)
