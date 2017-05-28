import React, { Component } from 'react'
import { connect } from 'react-redux'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'
import Popover from 'stemn-shared/misc/Popover'
import PopoverFit from 'stemn-shared/misc/PopoverMenu/PopoverFit'
import MdExpandMore from 'react-icons/md/expand-more'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import classNames from 'classnames'

class PopoverDropdown extends Component {
  render() {
    const { children, options, model, value, dispatch, onChange, ...otherProps } = this.props
    const currentOption = options.find(option => option.value === value)

    return (
      <PopoverFit { ...otherProps }>
        <div className="layout-row layout-align-start-center flex">
          { children }
          { currentOption && currentOption.name ? currentOption.name : 'none' }
          <div className="flex" />
          <MdExpandMore style={ { marginLeft: '5px' } } size={ 15 } />
        </div>
        <div className="PopoverMenu">
          { options.map((option, idx) => {

            const onClick = () => {
              if (model) {
                dispatch(storeChange(model, option.value))
              }
              if (option.onClick) {
                option.onClick()
              }
              if (onChange) {
                onChange()
              }
            }
            return (
              <a
                key={ option.value || idx }
                onClick={ onClick }
                className={ classNames({ 'active' : value === option.value }) }
              >
                { option.name }
              </a>
            )
          })}
        </div>
      </PopoverFit>
    )
  }
}

export default connect()(PopoverDropdown)
